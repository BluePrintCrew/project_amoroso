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