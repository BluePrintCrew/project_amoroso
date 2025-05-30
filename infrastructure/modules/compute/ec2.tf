# EC2 인스턴스 시작 템플릿
resource "aws_launch_template" "backend" {
  name                   = "${var.environment}-backend-lt"
  image_id               = data.aws_ami.amazon_linux_arm.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  update_default_version = true

  # IAM 인스턴스 프로필 연결 (있는 경우)
  dynamic "iam_instance_profile" {
    for_each = var.iam_instance_profile != "" ? [1] : []
    content {
      name = var.iam_instance_profile
    }
  }

  vpc_security_group_ids = [var.ec2_security_group_id]

  # IMDS 설정 (IMDSv1과 IMDSv2 모두 허용)
  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "optional"  # IMDSv1과 v2 모두 허용
  }

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = var.ebs_volume_size
      volume_type           = "gp3"
      delete_on_termination = true
    }
  }

  # 사용자 데이터 (스프링부트 애플리케이션 설치 및 실행)
  user_data = base64encode(templatefile("${path.module}/templates/user-data.sh.tpl", {
    environment    = var.environment,
    s3_bucket_name = var.s3_bucket_name,
    jar_file_key   = var.jar_file_key,
    java_opts      = var.java_opts,
    enable_eip     = var.enable_eip ? "true" : "false"
  }))

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name        = "${var.environment}-backend"
      Environment = var.environment
      Terraform   = "true"
    }
  }

  # 스팟 인스턴스 설정 (개발 환경에만 활성화)
  dynamic "instance_market_options" {
    for_each = var.use_spot_instances ? [1] : []
    content {
      market_type = "spot"
      spot_options {
        max_price = var.spot_price
      }
    }
  }
}
