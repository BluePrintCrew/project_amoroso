/**
 * # AWS 보안 모듈
 * 
 * 이 모듈은 다음 리소스를 생성합니다:
 * - ALB(Application Load Balancer) 보안 그룹
 * - EC2 인스턴스 보안 그룹
 * - RDS 데이터베이스 보안 그룹
 */

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

# 보안 그룹 규칙을 분리하여 순환 참조 방지

# ALB HTTP 인바운드 트래픽 규칙
resource "aws_security_group_rule" "alb_http_ingress" {
  security_group_id = aws_security_group.alb.id
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "HTTP from anywhere (for redirection to HTTPS)"
}

# ALB HTTPS 인바운드 트래픽 규칙
resource "aws_security_group_rule" "alb_https_ingress" {
  security_group_id = aws_security_group.alb.id
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "HTTPS from anywhere"
}

# ALB 아웃바운드 트래픽 규칙
resource "aws_security_group_rule" "alb_egress" {
  security_group_id = aws_security_group.alb.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound traffic"
}

# ALB에서 EC2로의 트래픽 규칙
resource "aws_security_group_rule" "alb_to_ec2" {
  security_group_id        = aws_security_group.ec2.id
  type                     = "ingress"
  from_port                = 8080
  to_port                  = 8080
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb.id
  description              = "Traffic from ALB to EC2"
}

# EC2 SSH 인바운드 트래픽 규칙 (개발 환경용, 옵션)
resource "aws_security_group_rule" "ec2_ssh_ingress" {
  count             = var.enable_ssh ? 1 : 0
  security_group_id = aws_security_group.ec2.id
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = var.ssh_allowed_cidr
  description       = "SSH access"
}

# EC2 아웃바운드 트래픽 규칙
resource "aws_security_group_rule" "ec2_egress" {
  security_group_id = aws_security_group.ec2.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Internet access for updates and packages"
}

# EC2에서 RDS로의 트래픽 규칙
resource "aws_security_group_rule" "ec2_to_rds" {
  security_group_id        = aws_security_group.rds.id
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.ec2.id
  description              = "MySQL traffic from EC2 to RDS"
}

# RDS 아웃바운드 트래픽 규칙
resource "aws_security_group_rule" "rds_egress" {
  security_group_id = aws_security_group.rds.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound traffic"
}

# VPC 엔드포인트 인바운드 규칙 (외부 보안 그룹 이용)
resource "aws_security_group_rule" "endpoint_ingress" {
  count             = var.endpoint_security_group_id != "" ? 1 : 0
  security_group_id = var.endpoint_security_group_id
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = [var.vpc_cidr]
  description       = "HTTPS from VPC"
}

# VPC 엔드포인트 아웃바운드 규칙 (외부 보안 그룹 이용)
resource "aws_security_group_rule" "endpoint_egress" {
  count             = var.endpoint_security_group_id != "" ? 1 : 0
  security_group_id = var.endpoint_security_group_id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound traffic"
}
