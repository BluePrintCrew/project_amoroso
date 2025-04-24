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