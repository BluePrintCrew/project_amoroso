output "alb_security_group_id" {
  description = "ALB 보안 그룹 ID"
  value       = aws_security_group.alb.id
}

output "ec2_security_group_id" {
  description = "EC2 인스턴스 보안 그룹 ID"
  value       = aws_security_group.ec2.id
}

output "rds_security_group_id" {
  description = "RDS 데이터베이스 보안 그룹 ID"
  value       = aws_security_group.rds.id
}
