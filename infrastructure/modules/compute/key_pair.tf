# AWS 키페어 생성
resource "aws_key_pair" "imported" {
  key_name   = "awskeypair"
  public_key = file("~/awskeypair.pub")
}
