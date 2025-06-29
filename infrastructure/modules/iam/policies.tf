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

# SSM 파라미터 읽기 권한 정책
resource "aws_iam_policy" "ssm_parameter_policy" {
  name        = "ssm-parameter-policy-${var.environment}"
  description = "EC2 인스턴스가 SSM Parameter Store에서 값을 읽을 수 있는 권한 부여"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:*:*:parameter/${var.environment}/*"
      }
    ]
  })
}

# EIP 연결 권한 정책
resource "aws_iam_policy" "eip_policy" {
  name        = "eip-policy-${var.environment}"
  description = "EC2 인스턴스가 EIP를 연결할 수 있는 권한 부여"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeAddresses",
          "ec2:AssociateAddress",
          "ec2:DescribeInstances"
        ]
        Resource = "*"
      }
    ]
  })
}

# GitHub Actions용 S3 쓰기 권한 정책
resource "aws_iam_policy" "github_s3_write_policy" {
  name        = "github-s3-write-policy-${var.environment}"
  description = "GitHub Actions가 S3 버킷에 파일을 업로드할 수 있는 권한 부여"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          var.s3_bucket_arn,
          "${var.s3_bucket_arn}/*"
        ]
      }
    ]
  })
}

# GitHub Actions용 SSM Parameter Store 쓰기 권한 정책
resource "aws_iam_policy" "github_ssm_write_policy" {
  name        = "github-ssm-write-policy-${var.environment}"
  description = "GitHub Actions가 SSM Parameter Store에 환경변수를 저장할 수 있는 권한 부여"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:PutParameter",
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:*:*:parameter/${var.environment}/*"
      }
    ]
  })
}

# GitHub Actions용 EC2/Auto Scaling Group 조회 권한 정책
resource "aws_iam_policy" "github_ec2_asg_policy" {
  name        = "github-ec2-asg-policy-${var.environment}"
  description = "GitHub Actions가 ASG의 인스턴스들을 조회할 수 있는 권한 부여"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "autoscaling:DescribeAutoScalingGroups",
          "ec2:DescribeInstances"
        ]
        Resource = "*"
      }
    ]
  })
}

# GitHub Actions용 SSM 명령 실행 권한 정책
resource "aws_iam_policy" "github_ssm_command_policy" {
  name        = "github-ssm-command-policy-${var.environment}"
  description = "GitHub Actions가 SSM을 통해 EC2 인스턴스에 명령을 실행할 수 있는 권한 부여"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:SendCommand",
          "ssm:ListCommandInvocations",
          "ssm:DescribeInstanceInformation"
        ]
        Resource = "*"
      }
    ]
  })
}
