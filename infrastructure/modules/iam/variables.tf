variable "role_name" {
  description = "IAM 역할 이름"
  type        = string
}

variable "s3_bucket_arn" {
  description = "접근 권한을 부여할 S3 버킷의 ARN"
  type        = string
}

variable "environment" {
  description = "배포 환경 (dev, prod 등)"
  type        = string
}