/**
 * # AWS 데이터베이스 모듈
 * 
 * 이 모듈은 다음 리소스를 생성합니다:
 * - MySQL RDS 인스턴스
 * - 파라미터 그룹
 * - 서브넷 그룹
 */

# DB 서브넷 그룹
resource "aws_db_subnet_group" "main" {
  name       = "${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "${var.environment}-db-subnet-group"
    Environment = var.environment
    Terraform   = "true"
  }
}

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

# 암호화를 위한 KMS 키 (선택적)
resource "aws_kms_key" "rds" {
  count               = var.enable_encryption ? 1 : 0
  description         = "${var.environment} RDS Encryption Key"
  enable_key_rotation = true

  tags = {
    Name        = "${var.environment}-rds-kms-key"
    Environment = var.environment
    Terraform   = "true"
  }
}

# RDS 인스턴스
resource "aws_db_instance" "main" {
  identifier             = "${var.environment}-mysql"
  engine                 = "mysql"
  engine_version         = var.mysql_version
  instance_class         = var.instance_class
  allocated_storage      = 20 # gp3 스토리지 타입 사용 시 최소 20GB 필요
  storage_type           = "gp3"
  db_name                = var.database_name
  username               = var.database_username
  password               = var.database_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name
  vpc_security_group_ids = [var.rds_security_group_id]

  # 비용 최적화 설정
  multi_az                  = var.environment == "prod" ? var.enable_multi_az : false
  backup_retention_period   = var.environment == "prod" ? var.backup_retention_period : 1
  skip_final_snapshot       = var.environment == "dev" ? true : false
  final_snapshot_identifier = var.environment == "dev" ? null : "${var.environment}-mysql-final-snapshot-${formatdate("YYYYMMDDhhmmss", timestamp())}"
  copy_tags_to_snapshot     = true

  # 암호화 설정
  storage_encrypted = var.enable_encryption
  kms_key_id        = var.enable_encryption ? aws_kms_key.rds[0].arn : null

  # 성능 설정
  monitoring_interval = var.environment == "prod" ? 60 : 0 # 프로덕션 환경에서만 향상된 모니터링

  # 유지 관리 설정
  auto_minor_version_upgrade = true
  maintenance_window         = "Sun:03:00-Sun:04:00" # UTC 기준 (KST 12:00-13:00)
  backup_window              = "01:00-02:00"         # UTC 기준 (KST 10:00-11:00)

  # 삭제 방지 (프로덕션 환경에서만 활성화)
  deletion_protection = var.environment == "prod" ? true : false

  tags = {
    Name        = "${var.environment}-mysql"
    Environment = var.environment
    Terraform   = "true"
  }
}
