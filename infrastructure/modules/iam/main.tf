variable "role_name" {
  description = "IAM 역할 이름"
  type        = string
}

variable "s3_bucket_arn" {
  description = "접근 권한을 부여할 S3 버킷의 ARN"
  type        = string
}

variable "environment" {
  description = "배포 환경 (dev, prod 등)"
  type        = string
}

# EC2 인스턴스 프로필
resource "aws_iam_instance_profile" "ec2_s3_profile" {
  name = "${var.role_name}-${var.environment}"
  role = aws_iam_role.ec2_s3_role.name
}

# IAM 역할
resource "aws_iam_role" "ec2_s3_role" {
  name = "${var.role_name}-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.role_name}-${var.environment}"
    Environment = var.environment
  }
}

# S3 읽기 권한 정책
resource "aws_iam_policy" "s3_access_policy" {
  name        = "s3-access-policy-${var.environment}"
  description = "EC2 인스턴스가 S3 버킷에 접근할 수 있는 권한 부여"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          var.s3_bucket_arn,
          "${var.s3_bucket_arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListAllMyBuckets"
        ]
        Resource = "*"
      }
    ]
  })
}

# IAM 역할에 정책 연결
resource "aws_iam_role_policy_attachment" "s3_policy_attachment" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}

# SSM 접근을 위한 정책 연결
resource "aws_iam_role_policy_attachment" "ssm_policy_attachment" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# 출력값 정의
output "instance_profile_name" {
  value       = aws_iam_instance_profile.ec2_s3_profile.name
  description = "생성된 IAM 인스턴스 프로필 이름"
}

output "role_arn" {
  value       = aws_iam_role.ec2_s3_role.arn
  description = "생성된 IAM 역할 ARN"
}
