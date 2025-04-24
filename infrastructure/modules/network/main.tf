/**
 * # AWS 네트워크 모듈
 * 
 * 이 모듈은 다음 리소스를 생성합니다:
 * - VPC
 * - 퍼블릭 및 프라이빗 서브넷 (지정된 가용영역에)
 * - 인터넷 게이트웨이
 * - NAT 게이트웨이 (선택적)
 * - 라우팅 테이블
 */

provider "aws" {
  region = var.region
}

# VPC 생성
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
    Terraform   = "true"
  }
}

# 인터넷 게이트웨이 생성
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.environment}-igw"
    Environment = var.environment
    Terraform   = "true"
  }
}

# 퍼블릭 서브넷 생성
resource "aws_subnet" "public" {
  count                   = length(var.public_subnets_cidr)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = element(var.public_subnets_cidr, count.index)
  availability_zone       = element(var.availability_zones, count.index)
  map_public_ip_on_launch = true  # 퍼블릭 서브넷은 자동으로 퍼블릭 IP 할당

  tags = {
    Name        = "${var.environment}-public-subnet-${count.index + 1}"
    Environment = var.environment
    Terraform   = "true"
    Tier        = "Public"
  }
}

# 프라이빗 서브넷 생성
resource "aws_subnet" "private" {
  count                   = length(var.private_subnets_cidr)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = element(var.private_subnets_cidr, count.index)
  availability_zone       = element(var.availability_zones, count.index)
  map_public_ip_on_launch = false

  tags = {
    Name        = "${var.environment}-private-subnet-${count.index + 1}"
    Environment = var.environment
    Terraform   = "true"
    Tier        = "Private"
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

# SSM 접속을 위한 VPC 엔드포인트 설정
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
