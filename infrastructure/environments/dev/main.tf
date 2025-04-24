provider "aws" {
  region = "ap-northeast-2"
}

terraform {
  required_providers {
    aws = {
      source  = "opentofu/aws"
      version = "~> 5.0"
    }
  }

  # 로컬 상태 파일 사용 (개인 개발 환경에 적합)
  # 팀 환경이나 프로덕션에서는 원격 백엔드 사용 권장
}

module "network" {
  source = "../../modules/network"

  environment          = "dev"
  vpc_cidr             = "10.0.0.0/16"
  availability_zones   = ["ap-northeast-2a", "ap-northeast-2c"]
  public_subnets_cidr  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets_cidr = ["10.0.11.0/24", "10.0.12.0/24"]
  enable_nat_gateway   = false # 개발 환경에서는 비용 절감을 위해 NAT 게이트웨이 비활성화
  create_vpc_endpoints = true  # SSM 엔드포인트 활성화
}

# 보안 모듈 추가
module "security" {
  source = "../../modules/security"

  environment              = "dev"
  vpc_id                   = module.network.vpc_id
  vpc_cidr                 = "10.0.0.0/16"
  enable_ssh               = true
  ssh_allowed_cidr         = ["0.0.0.0/0"] # 개발 환경에서는 모든 IP에서 SSH 접근 허용
  endpoint_security_group_id = module.network.endpoint_security_group_id
}

data "aws_acm_certificate" "dev" {
  domain      = "*.amoroso.blue"
  statuses    = ["ISSUED"]
  types       = ["AMAZON_ISSUED"]
  most_recent = true
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
  key_name           = "awskeypair" # SSH 키 페어 이름 추가
  instance_type      = "t4g.small"  # 2025년까지 월 750시간 무료 제공
  ebs_volume_size    = 8
  use_spot_instances = true # 비용 절감을 위해 스팟 인스턴스 사용

  # 오토 스케일링 설정
  asg_min_size         = 1
  asg_max_size         = 4
  asg_desired_capacity = 1

  # 프라이빗 서브넷 사용
  use_public_subnet = false

  # HTTPS 설정
  acm_certificate_arn = data.aws_acm_certificate.dev.arn

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
  database_name     = "devdb"
  database_username = "admin"
  database_password = "12345678" # 실제 환경에서는 외부에서 관리되는 비밀번호 사용 권장
}

# S3 버킷 모듈 추가 (스프링부트 JAR 파일 저장용)
module "storage" {
  source = "../../modules/storage"

  bucket_name   = "amoroso-app"
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
