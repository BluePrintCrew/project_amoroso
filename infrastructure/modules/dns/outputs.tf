output "zone_id" {
  description = "Route53 호스팅 영역 ID"
  value       = data.aws_route53_zone.this.zone_id
}

output "domain_name" {
  description = "구성된 도메인 이름"
  value       = var.domain_name
}

output "fqdn" {
  description = "ALB가 연결된 전체 도메인 이름"
  value       = aws_route53_record.alb.fqdn
}

output "certificate_arn" {
  description = "ACM 인증서 ARN"
  value       = var.existing_certificate_arn != "" ? var.existing_certificate_arn : var.create_acm_certificate ? aws_acm_certificate.this[0].arn : ""
}

output "certificate_domain_validation_options" {
  description = "인증서 검증 옵션 (인증서가 생성된 경우)"
  value       = var.create_acm_certificate ? aws_acm_certificate.this[0].domain_validation_options : []
}
