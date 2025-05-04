# 퍼블릭 라우팅 테이블
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.environment}-public-route-table"
    Environment = var.environment
    Terraform   = "true"
  }
}

# 퍼블릭 라우팅 테이블에 인터넷 게이트웨이로 가는 경로 추가
resource "aws_route" "public_internet_gateway" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
}

# 프라이빗 라우팅 테이블
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.environment}-private-route-table"
    Environment = var.environment
    Terraform   = "true"
  }
}

# 프라이빗 라우팅 테이블에 NAT 게이트웨이로 가는 경로 추가 (NAT 게이트웨이가 활성화된 경우)
resource "aws_route" "private_nat_gateway" {
  count                  = var.enable_nat_gateway ? 1 : 0
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.main[0].id
}

# 퍼블릭 서브넷을 퍼블릭 라우팅 테이블에 연결
resource "aws_route_table_association" "public" {
  count          = length(var.public_subnets_cidr)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public.id
}

# 프라이빗 서브넷을 프라이빗 라우팅 테이블에 연결
resource "aws_route_table_association" "private" {
  count          = length(var.private_subnets_cidr)
  subnet_id      = element(aws_subnet.private.*.id, count.index)
  route_table_id = aws_route_table.private.id
}