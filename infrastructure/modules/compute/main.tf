/**
 * # AWS 컴퓨팅 모듈
 * 
 * 이 모듈은 다음 리소스를 생성합니다:
 * - EC2 인스턴스 (백엔드 서버)
 * - Application Load Balancer
 * - Auto Scaling Group (옵션)
 */

# Amazon Linux 2023 ARM AMI 조회
data "aws_ami" "amazon_linux_arm" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-arm64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}