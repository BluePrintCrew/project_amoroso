variable "github_access_token" {
  description = "GitHub 액세스 토큰"
  type        = string
  sensitive   = true
}

variable "database_password" {
  description = "데이터베이스 비밀번호"
  type        = string
  sensitive   = true
}

variable "database_name" {
  description = "데이터베이스 이름"
  type        = string
  default     = "devdb"
}

variable "database_username" {
  description = "데이터베이스 사용자 이름"
  type        = string
  default     = "admin"
}

variable "key_name" {
  description = "EC2 인스턴스 접속용 SSH 키 페어 이름"
  type        = string
}

variable "aws_access_key" {
  description = "AWS 액세스 키"
  type        = string
  sensitive   = true
}

variable "aws_secret_key" {
  description = "AWS 시크릿 키"
  type        = string
  sensitive   = true
}

variable "route53_access_key" {
  description = "Route 53용 AWS 액세스 키"
  type        = string
  sensitive   = true
}

variable "route53_secret_key" {
  description = "Route 53용 AWS 시크릿 키"
  type        = string
  sensitive   = true
}

terraform {
  # 로컬 상태 파일 사용 (개인 개발 환경에 적합)
  # 팀 환경이나 프로덕션에서는 원격 백엔드 사용 권장
}

# 네트워크 모듈
module "network" {
  source = "../../modules/network"

  environment          = "dev"
  vpc_cidr             = "10.0.0.0/16"
  availability_zones   = ["ap-northeast-2a", "ap-northeast-2c"]
  public_subnets_cidr  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets_cidr = ["10.0.11.0/24", "10.0.12.0/24"]
  enable_nat_gateway   = false # 개발 환경에서는 비용 절감을 위해 NAT 게이트웨이 비활성화
  create_vpc_endpoints = false # 비용 절감을 위해 VPC 엔드포인트 비활성화
}

# 보안 모듈 추가
module "security" {
  source = "../../modules/security"

  environment                = "dev"
  vpc_id                     = module.network.vpc_id
  vpc_cidr                   = "10.0.0.0/16"
  enable_ssh                 = true
  ssh_allowed_cidr           = ["0.0.0.0/0"] # 개발 환경에서는 모든 IP에서 SSH 접근 허용
  endpoint_security_group_id = module.network.endpoint_security_group_id
}

# 인증서 모듈 추가
module "certificate" {
  source = "../../modules/certificate"
  providers = {
    aws        = aws
    aws.route53 = aws.route53
  }

  environment     = "dev"
  domain_name     = "amoroso.blue"
  create_wildcard = true  # 와일드카드 인증서 활성화
}

# DNS 모듈 추가
module "dns" {
  source = "../../modules/dns"
  providers = {
    aws = aws.route53
  }

  environment            = "dev"
  domain_name            = "amoroso.blue"
  subdomain              = "api"
  create_wildcard        = false  # 와일드카드 비활성화 - api 서브도메인만 생성
  create_root_record     = false
  alb_dns_name           = module.compute.alb_dns_name
  alb_zone_id            = module.compute.alb_zone_id
  create_acm_certificate = false

  # Amplify 도메인 설정은 frontend 모듈의 aws_amplify_domain_association 리소스로 처리됩니다.
}

# 컴퓨팅 모듈 추가
module "compute" {
  source = "../../modules/compute"

  environment           = "dev"
  vpc_id                = module.network.vpc_id
  public_subnet_ids     = module.network.public_subnet_ids
  private_subnet_ids    = module.network.private_subnet_ids
  ec2_security_group_id = module.security.ec2_security_group_id
  alb_security_group_id = module.security.alb_security_group_id

  # 인스턴스 설정
  key_name           = var.key_name # SSH 키 페어 이름 추가
  instance_type      = "t4g.small"  # 2025년까지 월 750시간 무료 제공
  ebs_volume_size    = 8
  use_spot_instances = true # 비용 절감을 위해 스팟 인스턴스 사용

  # 오토 스케일링 설정
  asg_min_size         = 1
  asg_max_size         = 1  # EIP 1개 사용을 위해 1로 제한
  asg_desired_capacity = 1

  # EIP 설정
  enable_eip = true
  eip_count  = 1

  # 퍼블릭 서브넷 사용
  use_public_subnet = true

  # HTTPS 설정
  acm_certificate_arn = module.certificate.certificate_arn

  # S3와 IAM 설정 추가
  iam_instance_profile = module.iam.instance_profile_name
  s3_bucket_name       = module.storage.bucket_id
  jar_file_key         = "application.jar"
  java_opts            = "-Xms256m -Xmx512m -Dspring.profiles.active=dev"
}

# 데이터베이스 모듈 추가
module "database" {
  source = "../../modules/database"

  environment           = "dev"
  private_subnet_ids    = module.network.private_subnet_ids
  rds_security_group_id = module.security.rds_security_group_id

  # 개발 환경에 적합한 프리티어 설정
  instance_class          = "db.t4g.micro"
  storage_size            = 20 # gp3 스토리지 타입의 최소 크기
  enable_multi_az         = false
  backup_retention_period = 1
  enable_encryption       = false

  # 데이터베이스 기본 설정
  database_name     = var.database_name
  database_username = var.database_username
  database_password = var.database_password
}

# S3 버킷 모듈 추가 (스프링부트 JAR 파일 저장용)
module "storage" {
  source = "../../modules/storage"

  bucket_name   = "amoroso-app-7v0olrvi"
  environment   = "dev"
  region        = "ap-northeast-2"
  force_destroy = true # 개발 환경에서는 버킷 삭제 시 콘텐츠도 삭제 허용
}

# IAM 모듈 추가 (EC2가 S3에 접근하기 위한 역할)
module "iam" {
  source = "../../modules/iam"

  role_name     = "ec2-s3-access"
  environment   = "dev"
  s3_bucket_arn = module.storage.bucket_arn
}

# 개발 환경 태그 설정
locals {
  common_tags = {
    Environment = "dev"
    Project     = "opentofu-aws-infra"
    Terraform   = "true"
    ManagedBy   = "opentofu"
  }
}

# 비용 할당 태그 모듈 추가
module "cost" {
  source = "../../modules/cost"

  # AWS 생성 태그 임시 비활성화 - 리소스 생성 후 활성화 예정
  additional_aws_tags = []
}

# Amplify 모듈 추가
module "frontend" {
  source = "../../modules/frontend"
  providers = {
    aws        = aws
    aws.route53 = aws.route53
  }

  environment         = "dev"
  app_name            = "project_amoroso"
  branch_name         = "develop"
  github_access_token = var.github_access_token
  monorepo_app_root   = "frontend/my-app"
  domain_name         = "amoroso.blue"
}

# 출력
output "vpc_id" {
  description = "VPC ID"
  value       = module.network.vpc_id
}

output "public_subnet_ids" {
  description = "퍼블릭 서브넷 ID"
  value       = module.network.public_subnet_ids
}

output "private_subnet_ids" {
  description = "프라이빗 서브넷 ID"
  value       = module.network.private_subnet_ids
}

output "alb_dns_name" {
  description = "ALB DNS 이름"
  value       = module.compute.alb_dns_name
}

output "db_endpoint" {
  description = "데이터베이스 엔드포인트"
  value       = module.database.db_instance_endpoint
}

output "s3_bucket_name" {
  description = "S3 버킷 이름"
  value       = module.storage.bucket_id
}

output "s3_bucket_domain" {
  description = "S3 버킷 도메인"
  value       = module.storage.bucket_domain_name
}

output "domain_name" {
  description = "애플리케이션 도메인 이름"
  value       = module.dns.fqdn
}

output "certificate_arn" {
  description = "ACM 인증서 ARN"
  value       = module.certificate.certificate_arn
}

output "amplify_app_id" {
  description = "Amplify 앱 ID"
  value       = module.frontend.app_id
}

output "amplify_default_domain" {
  description = "Amplify 앱 기본 도메인"
  value       = module.frontend.default_domain
}

output "eip_addresses" {
  description = "할당된 Elastic IP 주소 목록"
  value       = module.compute.eip_addresses
}
