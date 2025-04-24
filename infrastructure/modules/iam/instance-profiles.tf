# EC2 인스턴스 프로필
resource "aws_iam_instance_profile" "ec2_s3_profile" {
  name = "${var.role_name}-${var.environment}"
  role = aws_iam_role.ec2_s3_role.name
}