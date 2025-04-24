# 인터넷 게이트웨이 생성
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.environment}-igw"
    Environment = var.environment
    Terraform   = "true"
  }
}

# 탄력적 IP 생성 (NAT 게이트웨이용)
resource "aws_eip" "nat" {
  count = var.enable_nat_gateway ? 1 : 0
  domain = "vpc"

  tags = {
    Name        = "${var.environment}-nat-eip"
    Environment = var.environment
    Terraform   = "true"
  }
}

# NAT 게이트웨이 생성 (프로덕션 환경에만 해당)
resource "aws_nat_gateway" "main" {
  count         = var.enable_nat_gateway ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id # 첫 번째 퍼블릭 서브넷에 배치

  tags = {
    Name        = "${var.environment}-nat-gw"
    Environment = var.environment
    Terraform   = "true"
  }

  depends_on = [aws_internet_gateway.main]
}