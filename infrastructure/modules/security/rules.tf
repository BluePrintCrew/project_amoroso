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