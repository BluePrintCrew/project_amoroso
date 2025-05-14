resource "aws_amplify_app" "frontend" {
  name       = var.app_name
  repository = var.repository

  # GitHub 접근을 위한 액세스 토큰
  access_token = var.github_access_token

  # 빌드 설정
  build_spec = <<-EOT
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci --cache .npm --prefer-offline
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: build
        files:
          - '**/*'
      cache:
        paths:
          - .npm/**/*
    appRoot: ${var.monorepo_app_root}
  EOT

  # 환경 변수
  environment_variables = {
    AMPLIFY_DIFF_DEPLOY       = "false"
    AMPLIFY_MONOREPO_APP_ROOT = var.monorepo_app_root
  }

  # SPA(Single Page Application) 리다이렉트 규칙
  custom_rule {
    source = "/<*>"
    target = "/index.html"
    status = "404-200"
  }

  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>"
    target = "/index.html"
    status = "200"
  }

  # 기본값과 다른 설정만 명시
  enable_branch_auto_build    = false
  enable_branch_auto_deletion = false
  enable_auto_branch_creation = false
}

# 브랜치 설정
resource "aws_amplify_branch" "main" {
  framework   = "React"
  app_id      = aws_amplify_app.frontend.id
  branch_name = var.branch_name
  stage       = "DEVELOPMENT" # 개발 브랜치로 변경
}

# Route53 호스팅 영역 참조
data "aws_route53_zone" "this" {
  name = var.domain_name
}

# 도메인 연결 설정
resource "aws_amplify_domain_association" "domain" {
  app_id      = aws_amplify_app.frontend.id
  domain_name = var.domain_name

  # 루트 도메인 설정
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "" # 빈 문자열은 루트 도메인을 의미
  }

  # www 서브도메인 설정
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}

# 루트 도메인 레코드 생성
resource "aws_route53_record" "root_domain" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = element(split(" ", element([for s in aws_amplify_domain_association.domain.sub_domain : s.dns_record], 0)), 2)
    zone_id                = "Z2FDTNDATAQYW2" # CloudFront 고정 zone_id
    evaluate_target_health = false
  }

  # Amplify 도메인 연결이 완전히 설정될 때까지 대기
  depends_on = [aws_amplify_domain_association.domain]
}

# www 서브도메인 레코드 생성
resource "aws_route53_record" "www_domain" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = "www.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = ["${aws_amplify_app.frontend.default_domain}"]
}
