output "instance_profile_name" {
  value       = aws_iam_instance_profile.ec2_s3_profile.name
  description = "생성된 IAM 인스턴스 프로필 이름"
}

output "role_arn" {
  value       = aws_iam_role.ec2_s3_role.arn
  description = "생성된 IAM 역할 ARN"
}