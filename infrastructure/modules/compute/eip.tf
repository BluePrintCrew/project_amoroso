# Elastic IP 리소스
resource "aws_eip" "backend" {
  count  = var.enable_eip ? var.eip_count : 0
  domain = "vpc"

  tags = merge(
    {
      Name        = "${var.environment}-backend-eip-${count.index + 1}"
      Environment = var.environment
      Terraform   = "true"
      Purpose     = "SOLAPI SMS Service"
    },
    var.eip_tags
  )

  lifecycle {
    prevent_destroy = true
  }
}
