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