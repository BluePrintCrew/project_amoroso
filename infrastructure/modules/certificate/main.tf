terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~> 5.0"
      configuration_aliases = [aws.route53]
    }
  }
}

# Route53 호스팅 영역 조회 (aws.route53 프로바이더 사용)
data "aws_route53_zone" "this" {
  provider = aws.route53
  name     = var.domain_name
}

# ACM 인증서 생성 (기본 프로바이더 - 3750 계정)
resource "aws_acm_certificate" "this" {
  domain_name               = var.domain_name
  subject_alternative_names = var.create_wildcard ? ["*.${var.domain_name}"] : var.alternative_names
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.environment}-certificate"
    Environment = var.environment
    Terraform   = "true"
  }
}

# 인증서 검증을 위한 DNS 레코드 생성 (aws.route53 프로바이더 사용)
resource "aws_route53_record" "cert_validation" {
  provider = aws.route53
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.this.zone_id
}

# 인증서 검증 완료 대기
resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}