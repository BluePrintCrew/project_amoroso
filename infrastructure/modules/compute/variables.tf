variable "environment" {
  description = "환경 이름 (dev, prod 등)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "퍼블릭 서브넷 ID 목록"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "프라이빗 서브넷 ID 목록"
  type        = list(string)
}

variable "ec2_security_group_id" {
  description = "EC2 인스턴스용 보안 그룹 ID"
  type        = string
}

variable "alb_security_group_id" {
  description = "ALB용 보안 그룹 ID"
  type        = string
}

variable "instance_type" {
  description = "EC2 인스턴스 타입 (t4g.nano 또는 t4g.micro 권장)"
  type        = string
  default     = "t4g.micro"
}

variable "key_name" {
  description = "SSH 키 페어 이름 (선택사항)"
  type        = string
  default     = ""
}

variable "ebs_volume_size" {
  description = "EBS 볼륨 크기 (GB)"
  type        = number
  default     = 8
}

variable "use_spot_instances" {
  description = "스팟 인스턴스 사용 여부 (비용 절감)"
  type        = bool
  default     = false
}

variable "spot_price" {
  description = "스팟 인스턴스 최대 가격"
  type        = string
  default     = "0.01"
}

variable "asg_min_size" {
  description = "Auto Scaling 그룹 최소 크기"
  type        = number
  default     = 1
}

variable "asg_max_size" {
  description = "Auto Scaling 그룹 최대 크기"
  type        = number
  default     = 3
}

variable "asg_desired_capacity" {
  description = "Auto Scaling 그룹 기본 크기"
  type        = number
  default     = 1
}

variable "acm_certificate_arn" {
  description = "ACM 인증서 ARN (필수)"
  type        = string
}

variable "use_public_subnet" {
  description = "EC2 인스턴스를 퍼블릭 서브넷에 배치할지 여부"
  type        = bool
  default     = false
}

variable "iam_instance_profile" {
  description = "EC2 인스턴스에 연결할 IAM 인스턴스 프로필 이름"
  type        = string
  default     = ""
}

variable "s3_bucket_name" {
  description = "스프링부트 JAR 파일이 저장된 S3 버킷 이름"
  type        = string
  default     = ""
}

variable "jar_file_key" {
  description = "S3 버킷 내 스프링부트 JAR 파일 경로"
  type        = string
  default     = "application.jar"
}

variable "java_opts" {
  description = "자바 애플리케이션 실행 시 추가할 옵션"
  type        = string
  default     = "-Xms256m -Xmx512m"
}


