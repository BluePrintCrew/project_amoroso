# GitHub Actions OIDC Identity Provider
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
  
  client_id_list = [
    "sts.amazonaws.com"
  ]
  
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
  ]

  tags = {
    Name        = "github-actions-oidc-${var.environment}"
    Environment = var.environment
  }
}

# GitHub Actions용 IAM 역할
resource "aws_iam_role" "github_actions" {
  name = "github-actions-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              for branch in var.github_branches : 
              "repo:${var.github_repository}:ref:refs/heads/${branch}"
            ]
          }
        }
      }
    ]
  })

  tags = {
    Name        = "github-actions-role-${var.environment}"
    Environment = var.environment
  }
}

# GitHub Actions 역할에 S3 쓰기 권한 정책 연결
resource "aws_iam_role_policy_attachment" "github_s3_write" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_s3_write_policy.arn
}

# GitHub Actions 역할에 SSM 쓰기 권한 정책 연결
resource "aws_iam_role_policy_attachment" "github_ssm_write" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_ssm_write_policy.arn
}

# GitHub Actions 역할에 EC2/ASG 조회 권한 정책 연결
resource "aws_iam_role_policy_attachment" "github_ec2_asg" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_ec2_asg_policy.arn
}

# GitHub Actions 역할에 SSM 명령 실행 권한 정책 연결
resource "aws_iam_role_policy_attachment" "github_ssm_command" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_ssm_command_policy.arn
}