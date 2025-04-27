#!/bin/bash

# SpringBoot JAR 파일을 S3에 업로드하고 EC2 인스턴스에서 애플리케이션을 재시작하는 스크립트

# 사용법 확인
if [ $# -lt 2 ]; then
    echo "사용법: $0 <환경(dev/prod)> <JAR_파일_경로> [환경변수_파일_경로]"
    echo "예시: $0 dev ../backend/build/libs/application.jar"
    echo "예시 (환경변수 포함): $0 dev ../backend/build/libs/application.jar ./env/dev.env"
    exit 1
fi

ENV=$1
JAR_PATH=$2
ENV_FILE=${3:-""}    # 환경 변수 파일 경로 (선택 사항)

# JAR 파일 존재 여부 확인
if [ ! -f "$JAR_PATH" ]; then
    echo "오류: JAR 파일을 찾을 수 없습니다: $JAR_PATH"
    exit 1
fi

# 환경 변수 파일이 지정된 경우 존재 여부 확인
if [ ! -z "$ENV_FILE" ] && [ ! -f "$ENV_FILE" ]; then
    echo "오류: 환경 변수 파일을 찾을 수 없습니다: $ENV_FILE"
    exit 1
fi

# 환경 디렉토리 존재 여부 확인
ENV_DIR="../environments/$ENV"
if [ ! -d "$ENV_DIR" ]; then
    echo "오류: 환경 디렉토리를 찾을 수 없습니다: $ENV_DIR"
    exit 1
fi

# OpenTofu 출력에서 버킷 이름 가져오기
echo "S3 버킷 이름 가져오는 중..."
cd "$ENV_DIR"
BUCKET_NAME=$(tofu output -raw s3_bucket_name 2>/dev/null)
cd - > /dev/null

if [ -z "$BUCKET_NAME" ]; then
    echo "오류: S3 버킷 이름을 가져올 수 없습니다. OpenTofu 출력을 확인해주세요."
    exit 1
fi

echo "S3 버킷 사용 중: $BUCKET_NAME"

# JAR 파일 이름 추출
JAR_FILENAME="application.jar"

# S3에 JAR 파일 업로드
echo "S3에 JAR 파일 업로드 중..."
aws s3 cp "$JAR_PATH" "s3://$BUCKET_NAME/$JAR_FILENAME"

if [ $? -ne 0 ]; then
    echo "오류: JAR 파일 업로드 실패"
    exit 1
fi

echo "JAR 파일이 성공적으로 업로드 되었습니다: s3://$BUCKET_NAME/$JAR_FILENAME"

# 환경 변수 업데이트 (지정된 경우)
if [ ! -z "$ENV_FILE" ]; then
    echo "환경 변수 업데이트 중..."
    ./upload_env.sh "$ENV" "$ENV_FILE"

    if [ $? -ne 0 ]; then
        echo "오류: 환경 변수 업데이트 실패"
        exit 1
    fi

    echo "환경 변수가 성공적으로 업데이트되었습니다."
else
    echo "환경 변수 파일이 지정되지 않았습니다. 환경 변수 업데이트를 건너뜁니다."
fi

# EC2 인스턴스를 찾아 SpringBoot 서비스 재시작
echo -e "\n============================================================"
echo "EC2 인스턴스에서 애플리케이션 재시작 중..."
echo "============================================================"

# Auto Scaling Group 이름 가져오기
cd "$ENV_DIR"
ASG_NAME="${ENV}-backend-asg"
cd - > /dev/null

# ASG에서 인스턴스 ID 가져오기
echo "Auto Scaling Group($ASG_NAME)에서 인스턴스 ID 가져오는 중..."
INSTANCE_IDS=$(aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names "$ASG_NAME" --query "AutoScalingGroups[0].Instances[*].InstanceId" --output text)

if [ -z "$INSTANCE_IDS" ]; then
    echo "경고: 실행 중인 EC2 인스턴스를 찾을 수 없습니다."
    echo "배포가 완료되었으나, 인스턴스가 시작될 때 새 버전이 자동으로 다운로드됩니다."
    exit 0
fi

# 인스턴스 개수 계산
INSTANCE_COUNT=$(echo $INSTANCE_IDS | wc -w)
echo -e "총 ${INSTANCE_COUNT}개의 인스턴스를 찾았습니다.\n"

# 각 인스턴스에서 서비스 재시작
CURRENT=1
for INSTANCE_ID in $INSTANCE_IDS; do
    echo -e "\n-------------------------------------------------------------"
    echo "[$CURRENT/$INSTANCE_COUNT] 인스턴스 ${INSTANCE_ID} 업데이트 중..."
    echo -e "-------------------------------------------------------------\n"
    
    # 명령 실행
    aws ssm send-command \
        --instance-ids "$INSTANCE_ID" \
        --document-name "AWS-RunShellScript" \
        --parameters "commands=[ \
            \"aws s3 cp s3://$BUCKET_NAME/$JAR_FILENAME /opt/app/application.jar\", \
            \"sudo chown ec2-user:ec2-user /opt/app/application.jar\", \
            \"sudo chmod 755 /opt/app/application.jar\", \
            \"sudo systemctl restart load-env-vars.service\", \
            \"sudo systemctl restart springboot.service\" \
        ]" \
        --comment "SpringBoot 애플리케이션 재배포" > /dev/null

    if [ $? -eq 0 ]; then
        echo "✅ 인스턴스 ${INSTANCE_ID} 업데이트 완료!"
    else
        echo "❌ 경고: 인스턴스 ${INSTANCE_ID}에 명령 전송 실패. 인스턴스에서 SSM 에이전트가 실행 중인지 확인하세요."
    fi
    
    CURRENT=$((CURRENT + 1))
done

echo -e "\n============================================================"
echo "배포 요약"
echo "============================================================"
echo "환경: $ENV"
echo "JAR 파일: $JAR_PATH"
echo "총 인스턴스 수: $INSTANCE_COUNT"
echo "배포가 완료되었습니다! 몇 초 내에 애플리케이션이 새 버전으로 실행될 것입니다."
echo "============================================================"

