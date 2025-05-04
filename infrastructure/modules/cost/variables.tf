# 비용 할당 태그 모듈 변수

variable "additional_aws_tags" {
  description = "비용 할당 태그로 활성화할 추가 AWS 정의 태그 목록 (이미 리소스에 적용된 태그만 포함)"
  type        = list(string)
  default     = []
}
