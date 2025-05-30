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

# IAM 역할에 정책 연결
resource "aws_iam_role_policy_attachment" "s3_policy_attachment" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}

# SSM 파라미터 접근을 위한 정책 연결
resource "aws_iam_role_policy_attachment" "ssm_parameter_policy_attachment" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = aws_iam_policy.ssm_parameter_policy.arn
}

# SSM 접근을 위한 정책 연결
resource "aws_iam_role_policy_attachment" "ssm_policy_attachment" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# EIP 연결을 위한 정책 연결
resource "aws_iam_role_policy_attachment" "eip_policy_attachment" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = aws_iam_policy.eip_policy.arn
}
