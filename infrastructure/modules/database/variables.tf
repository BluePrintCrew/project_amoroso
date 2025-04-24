variable "environment" {
  description = "환경 이름 (dev, prod 등)"
  type        = string
}

variable "private_subnet_ids" {
  description = "RDS가 배치될 프라이빗 서브넷 ID 목록"
  type        = list(string)
}

variable "rds_security_group_id" {
  description = "RDS 보안 그룹 ID"
  type        = string
}

variable "instance_class" {
  description = "RDS 인스턴스 클래스 (db.t4g.micro 또는 db.t4g.small 권장)"
  type        = string
  default     = "db.t4g.micro"
}

variable "storage_size" {
  description = "RDS 스토리지 크기 (GB)"
  type        = number
  default     = 20
}

variable "mysql_version" {
  description = "MySQL 버전"
  type        = string
  default     = "8.0"
}

variable "database_name" {
  description = "데이터베이스 이름"
  type        = string
}

variable "database_username" {
  description = "데이터베이스 사용자 이름"
  type        = string
}

variable "database_password" {
  description = "데이터베이스 비밀번호"
  type        = string
  sensitive   = true
}

variable "enable_multi_az" {
  description = "다중 AZ 배포 활성화 여부"
  type        = bool
  default     = false
}

variable "backup_retention_period" {
  description = "자동 백업 보관 기간 (일)"
  type        = number
  default     = 7
}

variable "enable_encryption" {
  description = "스토리지 암호화 활성화 여부"
  type        = bool
  default     = false
}
