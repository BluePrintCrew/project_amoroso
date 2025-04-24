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
