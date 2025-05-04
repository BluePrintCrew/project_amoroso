output "db_instance_id" {
  description = "RDS 인스턴스 ID"
  value       = aws_db_instance.main.id
}

output "db_instance_address" {
  description = "RDS 인스턴스 주소"
  value       = aws_db_instance.main.address
}

output "db_instance_endpoint" {
  description = "RDS 인스턴스 엔드포인트"
  value       = aws_db_instance.main.endpoint
}

output "db_instance_name" {
  description = "데이터베이스 이름"
  value       = aws_db_instance.main.db_name
}

output "db_subnet_group_id" {
  description = "DB 서브넷 그룹 ID"
  value       = aws_db_subnet_group.main.id
}

output "db_parameter_group_id" {
  description = "DB 파라미터 그룹 ID"
  value       = aws_db_parameter_group.main.id
}
