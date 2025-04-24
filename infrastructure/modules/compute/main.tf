/**
 * # AWS 컴퓨팅 모듈
 * 
 * 이 모듈은 다음 리소스를 생성합니다:
 * - EC2 인스턴스 (백엔드 서버)
 * - Application Load Balancer
 * - Auto Scaling Group (옵션)
 */

# Amazon Linux 2023 ARM AMI 조회
data "aws_ami" "amazon_linux_arm" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-arm64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

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

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = var.ebs_volume_size
      volume_type           = "gp3"
      delete_on_termination = true
    }
  }

  # 사용자 데이터 (스프링부트 애플리케이션 설치 및 실행)
  user_data = base64encode(<<-EOF
    #!/bin/bash
    echo "Environment: ${var.environment}" > /etc/environment
    
    # 시스템 업데이트 및 필요 패키지 설치
    yum update -y
    yum install -y java-21-amazon-corretto
    
    # 애플리케이션 디렉토리 생성
    mkdir -p /opt/app
    
    # S3에서 JAR 파일 다운로드 (IAM 역할 사용)
    if [ -n "${var.s3_bucket_name}" ] && [ -n "${var.jar_file_key}" ]; then
      aws s3 cp s3://${var.s3_bucket_name}/${var.jar_file_key} /opt/app/application.jar
      
      # systemd 서비스 생성 (애플리케이션 자동 실행)
      cat > /etc/systemd/system/springboot.service << 'SERVICE'
[Unit]
Description=Spring Boot Application
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/opt/app
ExecStart=/usr/bin/java ${var.java_opts} -jar /opt/app/application.jar
SuccessExitStatus=143
TimeoutStopSec=10
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

      # 권한 설정 및 서비스 시작
      chown -R ec2-user:ec2-user /opt/app
      chmod 755 /opt/app/application.jar
      systemctl enable springboot.service
      systemctl start springboot.service
    else
      echo "S3 버킷 또는 JAR 파일 경로가 설정되지 않아 애플리케이션을 다운로드하지 않습니다." > /opt/app/README.txt
    fi
  EOF
  )

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

# ALB 타겟 그룹
resource "aws_lb_target_group" "backend" {
  name     = "${var.environment}-backend-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/health"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }

  tags = {
    Name        = "${var.environment}-backend-tg"
    Environment = var.environment
    Terraform   = "true"
  }
}

# Application Load Balancer
resource "aws_lb" "backend" {
  name               = "${var.environment}-backend-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  # 비용 절감을 위한 설정
  enable_deletion_protection = var.environment == "prod" ? true : false

  tags = {
    Name        = "${var.environment}-backend-alb"
    Environment = var.environment
    Terraform   = "true"
  }
}

# ALB 리스너 (HTTP) - HTTPS로 리디렉션
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.backend.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# ALB 리스너 (HTTPS) - 모든 환경에 활성화
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.backend.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}


