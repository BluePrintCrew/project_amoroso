#!/bin/bash
echo "Environment: ${environment}" > /etc/environment

# 시스템 업데이트 및 필요 패키지 설치
yum update -y
yum install -y java-21-amazon-corretto

# 애플리케이션 디렉토리 생성
mkdir -p /opt/app

# 로그 디렉토리 생성
mkdir -p /opt/app/logs
chown -R ec2-user:ec2-user /opt/app/logs
chmod 755 /opt/app/logs

# S3에서 JAR 파일 다운로드 (IAM 역할 사용)
if [ -n "${s3_bucket_name}" ] && [ -n "${jar_file_key}" ]; then
  aws s3 cp s3://${s3_bucket_name}/${jar_file_key} /opt/app/application.jar
  
  # systemd 서비스 생성 (애플리케이션 자동 실행)
  cat > /etc/systemd/system/springboot.service << 'SERVICE'
[Unit]
Description=Spring Boot Application
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/opt/app
EnvironmentFile=/opt/app/application.env
ExecStart=/usr/bin/java ${java_opts} -jar /opt/app/application.jar
SuccessExitStatus=143
TimeoutStopSec=10
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

  # 환경 변수 파일 생성 스크립트
  cat > /opt/app/load_parameters.sh << 'LOADSCRIPT'
#!/bin/bash
ENV_FILE="/opt/app/application.env"
PREFIX="/${environment}/amoroso"

# 기존 환경 파일 초기화
echo "# Application Environment Variables - Generated $(date)" > $ENV_FILE

# SSM Parameter Store에서 애플리케이션 환경 변수 로드
echo "Loading environment variables from SSM Parameter Store..."
aws ssm get-parameters-by-path \
  --path "$PREFIX" \
  --recursive \
  --with-decryption \
  --query "Parameters[*].{Name:Name,Value:Value}" \
  --output text | while read -r name value; do
    # 파라미터 이름에서 경로 제거하고 환경 변수 형식으로 변환
    param_name=$(echo "$name" | sed "s|$PREFIX/||" | tr '[:lower:]' '[:upper:]' | tr '-' '_')
    echo "$param_name=$value" >> $ENV_FILE
done

# 추가 기본 환경 변수 설정
echo "SERVER_PORT=8080" >> $ENV_FILE
echo "ENVIRONMENT=${environment}" >> $ENV_FILE

chown ec2-user:ec2-user $ENV_FILE
chmod 640 $ENV_FILE
LOADSCRIPT

  # 스크립트 실행 권한 설정
  chmod +x /opt/app/load_parameters.sh
  /opt/app/load_parameters.sh
  
  # 권한 설정 및 서비스 시작
  chown -R ec2-user:ec2-user /opt/app
  chmod 755 /opt/app/application.jar
  
  # 서비스 재시작 시 항상 최신 환경 변수 로드
  cat > /etc/systemd/system/load-env-vars.service << 'ENVSERVICE'
[Unit]
Description=Load Environment Variables from SSM
Before=springboot.service

[Service]
Type=oneshot
ExecStart=/opt/app/load_parameters.sh
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
ENVSERVICE

  # 서비스 활성화 및 시작
  systemctl enable load-env-vars.service
  systemctl start load-env-vars.service
  systemctl enable springboot.service
  systemctl start springboot.service
else
  echo "S3 버킷 또는 JAR 파일 경로가 설정되지 않아 애플리케이션을 다운로드하지 않습니다." > /opt/app/README.txt
fi