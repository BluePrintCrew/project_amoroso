#!/bin/bash

# 환경 변수를 AWS SSM Parameter Store에 업로드하는 스크립트

# 사용법 확인
if [ $# -lt 2 ]; then
    echo "사용법: $0 <환경(dev/prod)> <환경변수_파일_경로>"
    echo "예시: $0 dev ./env/dev.env"
    exit 1
fi

ENV=$1
ENV_FILE=$2

# 환경 파일 존재 여부 확인
if [ ! -f "$ENV_FILE" ]; then
    echo "오류: 환경 변수 파일을 찾을 수 없습니다: $ENV_FILE"
    exit 1
fi

# 파라미터 스토어에 업로드할 PREFIX 설정
PREFIX="/${ENV}/amoroso"

echo "환경변수를 AWS Parameter Store에 업로드 중... (환경: $ENV, 접두사: $PREFIX)"
echo "파일: $ENV_FILE"

# 암호화할 변수들 (대소문자 구분 없음)
SECURE_PARAMS=("password" "secret" "key" "token" "credential")

# 환경 변수 파일 읽기 및 파라미터 스토어에 업로드
while IFS='=' read -r key value || [ -n "$key" ]; do
    # 주석이나 빈 줄 무시
    [[ $key =~ ^#.* || -z $key ]] && continue
    
    # 변수 이름과 값 정리 (공백 제거)
    key=$(echo $key | xargs)
    value=$(echo $value | xargs)
    
    # 파라미터 이름 생성 (소문자로 변환하고 _ 대신 - 사용)
    param_name=$(echo $key | tr '[:upper:]' '[:lower:]' | tr '_' '-')
    
    # 민감한 정보는 SecureString으로 저장, 나머지는 String으로 저장
    is_secure=false
    for secure in "${SECURE_PARAMS[@]}"; do
        if [[ $param_name == *"$secure"* ]]; then
            is_secure=true
            break
        fi
    done
    
    # 전체 파라미터 경로
    param_path="${PREFIX}/${param_name}"
    
    if [ "$is_secure" = true ]; then
            echo "SecureString 저장 중: ${param_path}"
            aws ssm put-parameter \
                --name "${param_path}" \
                --value "${value}" \
                --type "SecureString" \
                --overwrite \
                --no-cli-pager
        else
            echo "String 저장 중: ${param_path}"
            aws ssm put-parameter \
                --name "${param_path}" \
                --value "${value}" \
                --type "String" \
                --overwrite \
                --no-cli-pager
        fi
        
        if [ $? -ne 0 ]; then
            echo "오류: '${param_path}' 파라미터 저장 실패"
        fi
done < "$ENV_FILE"

echo "환경 변수 업로드가 완료되었습니다."
echo "다음 명령으로 업로드된 파라미터를 확인할 수 있습니다:"
echo "aws ssm get-parameters-by-path --path \"$PREFIX\" --recursive --with-decryption"