output "alb_dns_name" {
  description = "ALB DNS 이름"
  value       = aws_lb.backend.dns_name
}

output "alb_arn" {
  description = "ALB ARN"
  value       = aws_lb.backend.arn
}

output "alb_zone_id" {
  description = "ALB 호스팅 영역 ID"
  value       = aws_lb.backend.zone_id
}

output "target_group_arn" {
  description = "ALB 타겟 그룹 ARN"
  value       = aws_lb_target_group.backend.arn
}

output "autoscaling_group_name" {
  description = "Auto Scaling 그룹 이름"
  value       = aws_autoscaling_group.backend.name
}

output "launch_template_id" {
  description = "시작 템플릿 ID"
  value       = aws_launch_template.backend.id
}

output "eip_addresses" {
  description = "Elastic IP 주소 목록"
  value       = var.enable_eip ? aws_eip.backend[*].public_ip : []
}

output "eip_allocation_ids" {
  description = "EIP Allocation ID 목록 (user-data에서 사용)"
  value       = var.enable_eip ? aws_eip.backend[*].allocation_id : []
}
