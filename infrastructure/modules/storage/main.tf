variable "bucket_name" {
  description = "이름 접두사로 사용할 S3 버킷 이름"
  type        = string
}

variable "environment" {
  description = "배포 환경 (dev, prod 등)"
  type        = string
}

variable "region" {
  description = "AWS 리전"
  type        = string
  default     = "ap-northeast-2"
}

variable "force_destroy" {
  description = "버킷 삭제 시 내용물도 함께 삭제 여부"
  type        = bool
  default     = false
}

# S3 버킷 생성
resource "aws_s3_bucket" "app_bucket" {
  bucket = "${var.bucket_name}-${var.environment}"
  force_destroy = var.force_destroy

  tags = {
    Name        = "${var.bucket_name}-${var.environment}"
    Environment = var.environment
  }
}

# 버킷 ACL 설정
resource "aws_s3_bucket_ownership_controls" "app_bucket_ownership" {
  bucket = aws_s3_bucket.app_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "app_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.app_bucket_ownership]
  
  bucket = aws_s3_bucket.app_bucket.id
  acl    = "private"
}

# 버킷 버전 관리 설정
resource "aws_s3_bucket_versioning" "app_bucket_versioning" {
  bucket = aws_s3_bucket.app_bucket.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

# 출력값 정의
output "bucket_id" {
  value       = aws_s3_bucket.app_bucket.id
  description = "생성된 S3 버킷 ID"
}

output "bucket_arn" {
  value       = aws_s3_bucket.app_bucket.arn
  description = "생성된 S3 버킷 ARN"
}

output "bucket_domain_name" {
  value       = aws_s3_bucket.app_bucket.bucket_domain_name
  description = "생성된 S3 버킷 도메인 이름"
}