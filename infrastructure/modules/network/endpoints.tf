# VPC 엔드포인트를 위한 보안 그룹
resource "aws_security_group" "endpoint" {
  count       = var.create_vpc_endpoints ? 1 : 0
  name        = "${var.environment}-endpoint-sg"
  description = "Security group for VPC endpoints"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name        = "${var.environment}-endpoint-sg"
    Environment = var.environment
    Terraform   = "true"
  }
}

# VPC 엔드포인트 보안 그룹 인바운드 규칙
resource "aws_security_group_rule" "endpoint_ingress" {
  count             = var.create_vpc_endpoints ? 1 : 0
  security_group_id = aws_security_group.endpoint[0].id
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = [var.vpc_cidr]
  description       = "HTTPS from VPC"
}

# VPC 엔드포인트 보안 그룹 아웃바운드 규칙
resource "aws_security_group_rule" "endpoint_egress" {
  count             = var.create_vpc_endpoints ? 1 : 0
  security_group_id = aws_security_group.endpoint[0].id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound traffic"
}

# SSM 엔드포인트
resource "aws_vpc_endpoint" "ssm" {
  count               = var.create_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.region}.ssm"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  subnet_ids          = aws_subnet.private.*.id
  security_group_ids  = [aws_security_group.endpoint[0].id]

  tags = {
    Name        = "${var.environment}-ssm-endpoint"
    Environment = var.environment
    Terraform   = "true"
  }
}

# SSM Messages 엔드포인트
resource "aws_vpc_endpoint" "ssmmessages" {
  count               = var.create_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.region}.ssmmessages"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  subnet_ids          = aws_subnet.private.*.id
  security_group_ids  = [aws_security_group.endpoint[0].id]

  tags = {
    Name        = "${var.environment}-ssmmessages-endpoint"
    Environment = var.environment
    Terraform   = "true"
  }
}

# EC2 Messages 엔드포인트
resource "aws_vpc_endpoint" "ec2messages" {
  count               = var.create_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.region}.ec2messages"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  subnet_ids          = aws_subnet.private.*.id
  security_group_ids  = [aws_security_group.endpoint[0].id]

  tags = {
    Name        = "${var.environment}-ec2messages-endpoint"
    Environment = var.environment
    Terraform   = "true"
  }
}