terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# 기본 AWS 계정. dns모듈을 제외한 모든 모듈에 적용
provider "aws" {
  region     = "ap-northeast-2"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

# route53만 persona 프로파일 사용. (프리티어 만료 AWS 계정)
provider "aws" {
  alias      = "route53"
  region     = "ap-northeast-2"
  access_key = var.route53_access_key
  secret_key = var.route53_secret_key
}

# 현재 사용 중인 AWS 계정 확인용 데이터 소스
data "aws_caller_identity" "default" {}
data "aws_caller_identity" "route53" {
  provider = aws.route53
}

# 계정 ID 출력
output "default_account_id" {
  value = data.aws_caller_identity.default.account_id
  description = "Default AWS provider account ID (새 계정)"
}

output "route53_account_id" {
  value = data.aws_caller_identity.route53.account_id
  description = "Route53 AWS provider account ID (기존 계정)"
}