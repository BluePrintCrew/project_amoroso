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