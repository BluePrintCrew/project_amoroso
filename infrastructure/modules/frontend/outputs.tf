output "app_id" {
  description = "Amplify 앱 ID"
  value       = aws_amplify_app.frontend.id
}

output "app_arn" {
  description = "Amplify 앱 ARN"
  value       = aws_amplify_app.frontend.arn
}

output "default_domain" {
  description = "Amplify 앱 기본 도메인"
  value       = aws_amplify_app.frontend.default_domain
}

output "branch_id" {
  description = "Amplify 브랜치 ID"
  value       = aws_amplify_branch.main.id
}

output "custom_domain" {
  description = "Amplify 앱 사용자 정의 도메인"
  value       = var.domain_name
}
