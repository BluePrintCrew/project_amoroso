# 오토 스케일링 그룹
resource "aws_autoscaling_group" "backend" {
  name             = "${var.environment}-backend-asg"
  min_size         = var.asg_min_size
  max_size         = var.asg_max_size
  desired_capacity = var.asg_desired_capacity

  vpc_zone_identifier = var.use_public_subnet ? var.public_subnet_ids : var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.backend.arn]

  launch_template {
    id      = aws_launch_template.backend.id
    version = aws_launch_template.backend.latest_version
  }

  # 인스턴스 리프레시 설정 (개발 환경과 프로덕션 환경에 각각 다른 설정 적용)
  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = var.environment == "prod" ? 90 : 50
      instance_warmup        = var.environment == "prod" ? 300 : 120
      auto_rollback          = var.environment == "prod" ? true : false
    }
    # 런치 템플릿 변경 시 인스턴스 리프레시 트리거
    triggers = ["launch_template"]
  }

  # 비용 절감을 위한 태그
  tag {
    key                 = "CostCenter"
    value               = var.environment
    propagate_at_launch = true
  }

  tag {
    key                 = "Environment"
    value               = var.environment
    propagate_at_launch = true
  }

  tag {
    key                 = "Terraform"
    value               = "true"
    propagate_at_launch = true
  }
}