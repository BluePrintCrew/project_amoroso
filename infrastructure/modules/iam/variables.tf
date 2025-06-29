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

# GitHub Actions OIDC 관련 변수들
variable "github_repository" {
  description = "GitHub 리포지토리 (예: owner/repo-name)"
  type        = string
  default     = "chaebeomsu/project_amoroso"
}

variable "github_branches" {
  description = "GitHub Actions에서 접근 허용할 브랜치들"
  type        = list(string)
  default     = ["main", "develop", "feature/github-actions-deployment"]
}