# 이 파일은 S3 버킷 접근 제어 관련 리소스를 포함합니다.
# 현재는 s3-buckets.tf에 ACL이 포함되어 있지만, 
# 필요시 여기에 추가 정책이나 제어 리소스를 정의할 수 있습니다.

# 예시: 퍼블릭 액세스 차단 설정
resource "aws_s3_bucket_public_access_block" "app_bucket_access" {
  bucket = aws_s3_bucket.app_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}