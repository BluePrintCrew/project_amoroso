output "certificate_arn" {
  description = "생성된 ACM 인증서의 ARN"
  value       = aws_acm_certificate_validation.this.certificate_arn
}

output "domain_validation_options" {
  description = "도메인 검증 옵션 목록"
  value       = aws_acm_certificate.this.domain_validation_options
}