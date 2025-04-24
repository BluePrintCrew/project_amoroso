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

  # 로컬 상태 파일 사용 
  # 실제 프로덕션 환경에서는 원격 백엔드 구성 권장
}

module "network" {
  source = "../../modules/network"

  environment          = "prod"
  vpc_cidr             = "10.0.0.0/16"
  availability_zones   = ["ap-northeast-2a", "ap-northeast-2c"]
  public_subnets_cidr  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets_cidr = ["10.0.11.0/24", "10.0.12.0/24"]
  enable_nat_gateway   = true # 프로덕션 환경에서는 NAT 게이트웨이 활성화
}

# 보안 모듈 추가
module "security" {
  source = "../../modules/security"

  environment = "prod"
  vpc_id      = module.network.vpc_id
  enable_ssh  = false # 프로덕션 환경에서는 SSH 접근 비활성화
}

# 프로덕션 환경에 사용할 ACM 인증서 (가정)
data "aws_acm_certificate" "prod" {
  domain      = "yourdomain.com" # 프로덕션 환경 도메인으로 변경 필요
  statuses    = ["ISSUED"]
  most_recent = true
}

# 컴퓨팅 모듈 추가
module "compute" {
  source = "../../modules/compute"

  environment           = "prod"
  vpc_id                = module.network.vpc_id
  public_subnet_ids     = module.network.public_subnet_ids
  private_subnet_ids    = module.network.private_subnet_ids
  ec2_security_group_id = module.security.ec2_security_group_id
  alb_security_group_id = module.security.alb_security_group_id

  # 인스턴스 설정
  instance_type      = "t4g.micro" # 프로덕션 환경에서는 더 안정적인 인스턴스 사용
  ebs_volume_size    = 20
  use_spot_instances = false # 프로덕션에서는 스팟 인스턴스 사용하지 않음

  # 오토 스케일링 설정
  asg_min_size         = 2
  asg_max_size         = 6
  asg_desired_capacity = 2

  # HTTPS 설정
  acm_certificate_arn = data.aws_acm_certificate.prod.arn
}

# 데이터베이스 모듈 추가
module "database" {
  source = "../../modules/database"

  environment           = "prod"
  private_subnet_ids    = module.network.private_subnet_ids
  rds_security_group_id = module.security.rds_security_group_id

  instance_class          = "db.t4g.small"
  storage_size            = 20
  enable_multi_az         = true
  backup_retention_period = 7
  enable_encryption       = true

  # 데이터베이스 설정
  database_name     = "proddb"
  database_username = "admin"
  database_password = "Use-SSM-Parameter-Store-In-Production"
}

# 프로덕션 환경 태그 설정
locals {
  common_tags = {
    Environment = "prod"
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

output "nat_gateway_ids" {
  description = "NAT 게이트웨이 ID"
  value       = module.network.nat_gateway_ids
}

output "alb_dns_name" {
  description = "ALB DNS 이름"
  value       = module.compute.alb_dns_name
}
