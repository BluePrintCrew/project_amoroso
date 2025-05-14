variable "environment" {
  description = "환경 이름 (dev, prod 등)"
  type        = string
}

variable "domain_name" {
  description = "Route53에서 관리할 도메인 이름 (예: example.com)"
  type        = string
}

variable "subdomain" {
  description = "생성할 서브도메인 (기본값은 빈 문자열로, 루트 도메인을 사용)"
  type        = string
  default     = ""
}

variable "create_wildcard" {
  description = "와일드카드 도메인을 생성할지 여부 (*.example.com)"
  type        = bool
  default     = false
}

variable "create_root_record" {
  description = "루트 도메인에 대한 레코드도 생성할지 여부 (서브도메인이 지정된 경우)"
  type        = bool
  default     = false
}

variable "alb_dns_name" {
  description = "ALB의 DNS 이름"
  type        = string
}

variable "alb_zone_id" {
  description = "ALB의 호스팅 영역 ID"
  type        = string
}

variable "create_acm_certificate" {
  description = "새 ACM 인증서를 생성할지 여부"
  type        = bool
  default     = false
}

variable "existing_certificate_arn" {
  description = "이미 존재하는 ACM 인증서 ARN (지정시 create_acm_certificate는 무시)"
  type        = string
  default     = ""
}

# Amplify 관련 설정은 frontend 모듈의 aws_amplify_domain_association 리소스로 처리됩니다.
