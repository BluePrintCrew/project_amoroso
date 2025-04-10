provider "aws" {
  region = "ap-northeast-2"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/24"

  tags = {
    Name = "amoroso-network"
  }
}

resource "aws_subnet" "az-a" {
  vpc_id     = "vpc-0e3a2c805db131dd6"
  cidr_block = "10.0.0.0/28"

  tags = {
    Name = "az-a"
  }
}
