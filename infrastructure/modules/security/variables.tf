variable "vpc_cidr" {
  description = "VPC CIDR 블록"
  type        = string
  default     = "10.0.0.0/16"
}

variable "environment" {
  description = "환경 이름 (dev, prod 등)"
  type        = string
}

variable "vpc_id" {
  description = "보안 그룹이 생성될 VPC ID"
  type        = string
}

variable "enable_ssh" {
  description = "SSH 접속 허용 여부"
  type        = bool
  default     = false
}

variable "ssh_allowed_cidr" {
  description = "SSH 접속을 허용할 CIDR 블록 (enable_ssh가 true인 경우에만 사용)"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "endpoint_security_group_id" {
  description = "VPC 엔드포인트에 적용할 보안 그룹 ID (네트워크 모듈에서 생성된 보안 그룹)"
  type        = string
  default     = ""
}
