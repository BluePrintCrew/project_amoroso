variable "environment" {
  description = "환경 이름 (dev, prod 등)"
  type        = string
}

variable "domain_name" {
  description = "Route53에서 관리할 도메인 이름 (예: example.com)"
  type        = string
}

variable "create_wildcard" {
  description = "와일드카드 도메인을 생성할지 여부 (*.example.com)"
  type        = bool
  default     = false
}

variable "alternative_names" {
  description = "추가 도메인 이름 목록 (create_wildcard가 false일 때 사용)"
  type        = list(string)
  default     = []
}