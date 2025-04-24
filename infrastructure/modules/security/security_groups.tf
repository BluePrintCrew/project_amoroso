# ALB 보안 그룹 - 비어있는 기본 그룹
resource "aws_security_group" "alb" {
  name        = "${var.environment}-alb-sg"
  description = "ALB Security Group"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.environment}-alb-sg"
    Environment = var.environment
    Terraform   = "true"
  }
}

# EC2 인스턴스 보안 그룹 - 비어있는 기본 그룹
resource "aws_security_group" "ec2" {
  name        = "${var.environment}-ec2-sg"
  description = "EC2 Security Group"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.environment}-ec2-sg"
    Environment = var.environment
    Terraform   = "true"
  }
}

# RDS 데이터베이스 보안 그룹 - 비어있는 기본 그룹
resource "aws_security_group" "rds" {
  name        = "${var.environment}-rds-sg"
  description = "RDS Security Group"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.environment}-rds-sg"
    Environment = var.environment
    Terraform   = "true"
  }
}