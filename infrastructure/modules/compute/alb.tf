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