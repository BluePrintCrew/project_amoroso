variable "region" {
  description = "AWS 리전"
  type        = string
  default     = "ap-northeast-2"
}

variable "environment" {
  description = "환경 이름 (dev, prod 등)"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR 블록"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "사용할 가용영역 목록"
  type        = list(string)
  default     = ["ap-northeast-2a", "ap-northeast-2c"]
}

variable "public_subnets_cidr" {
  description = "퍼블릭 서브넷 CIDR 블록 목록"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets_cidr" {
  description = "프라이빗 서브넷 CIDR 블록 목록"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "enable_nat_gateway" {
  description = "NAT 게이트웨이 생성 여부(비용 절감을 위해 개발 환경에서는 비활성화 가능)"
  type        = bool
  default     = false
}

variable "create_vpc_endpoints" {
  description = "SSM 엔드포인트 생성 여부(NAT 게이트웨이 없을 때 EC2에 SSM 접속을 위해 필요)"
  type        = bool
  default     = false
}
