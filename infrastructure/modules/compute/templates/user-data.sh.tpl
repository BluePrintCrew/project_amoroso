#!/bin/bash
echo "Environment: ${environment}" > /etc/environment

# 시스템 업데이트 및 필요 패키지 설치
yum update -y
yum install -y java-21-amazon-corretto

# Redis 설치 및 설정 (Amazon Linux 2023)
echo "[$(date)] Installing Redis..."
dnf install -y redis6
systemctl start redis6
systemctl enable redis6

# Redis 설정 파일 위치 확인 및 기본 보안 설정
REDIS_CONF="/etc/redis6.conf"
if [ -f "$REDIS_CONF" ]; then
    sed -i 's/^bind 127.0.0.1/bind 127.0.0.1/' "$REDIS_CONF"
    systemctl restart redis6
fi

echo "[$(date)] Redis installation completed"

# EIP 연결 (사용 가능한 EIP가 있는 경우)
if [ "${enable_eip}" = "true" ]; then
  echo "[$(date)] Starting EIP association..."
  
  # 인스턴스 정보 가져오기
  INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
  REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)
  
  echo "[$(date)] Instance ID: $INSTANCE_ID, Region: $REGION"
  
  # 사용 가능한 EIP 찾기 (연결되지 않은 EIP)
  AVAILABLE_EIP=$(aws ec2 describe-addresses \
    --region $REGION \
    --query 'Addresses[0].AllocationId' \
    --output text 2>&1)
  
  if [ $? -ne 0 ]; then
    echo "[$(date)] ERROR: Failed to describe addresses - $AVAILABLE_EIP"
  elif [ "$AVAILABLE_EIP" = "None" ] || [ -z "$AVAILABLE_EIP" ]; then
    echo "[$(date)] ERROR: No available EIP found"
    echo "[$(date)] DEBUG: All EIPs status:"
    aws ec2 describe-addresses --region $REGION --output table
  else
    echo "[$(date)] Found available EIP: $AVAILABLE_EIP"
    
    # EIP 연결 시도
    RESULT=$(aws ec2 associate-address \
      --region $REGION \
      --instance-id $INSTANCE_ID \
      --allocation-id $AVAILABLE_EIP 2>&1)
    
    if [ $? -eq 0 ]; then
      echo "[$(date)] SUCCESS: EIP associated successfully"
      echo "[$(date)] Result: $RESULT"
    else
      echo "[$(date)] ERROR: Failed to associate EIP - $RESULT"
      echo "[$(date)] TROUBLESHOOT: Check IAM permissions and EIP status"
    fi
  fi
else
  echo "[$(date)] EIP association disabled"
fi

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