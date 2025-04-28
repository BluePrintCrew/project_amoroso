# 비용 할당 태그 모듈 출력

output "activated_user_tags" {
  description = "활성화된 사용자 정의 비용 할당 태그 목록"
  value       = [
    "Environment",
    "Name",
    "Terraform"
  ]
}

output "activated_aws_tags" {
  description = "활성화된 AWS 정의 비용 할당 태그 목록"
  value       = [
    "aws:createdBy",
    "aws:cloudformation:stack-name",
    "aws:autoscaling:groupName"
  ]
}
