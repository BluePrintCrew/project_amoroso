# DB 파라미터 그룹
resource "aws_db_parameter_group" "main" {
  name   = "${var.environment}-mysql-params"
  family = "mysql8.0"

  # 성능 최적화 파라미터 (필요에 따라 조정)
  parameter {
    name  = "max_connections"
    value = var.environment == "prod" ? "150" : "50"
  }

  parameter {
    name  = "innodb_buffer_pool_size"
    value = var.environment == "prod" ? "{DBInstanceClassMemory*3/4}" : "{DBInstanceClassMemory*1/2}"
  }

  tags = {
    Name        = "${var.environment}-mysql-params"
    Environment = var.environment
    Terraform   = "true"
  }
}