# 배포 스크립트 사용 가이드

## S3를 통한 스프링부트 애플리케이션 배포 방법

이 디렉토리는 OpenTofu로 구축된 AWS 인프라에 스프링부트 애플리케이션을 배포하기 위한 스크립트를 포함하고 있습니다.

### 사전 요구사항

- AWS CLI가 설치되어 있어야 합니다.
- AWS CLI가 적절한 권한으로 구성되어 있어야 합니다.
- OpenTofu가 설치되어 있어야 합니다.
- 인프라가 이미 배포되어 있어야 합니다.

### 설정 단계

1. 프로젝트의 인프라 디렉토리로 이동합니다.

   ```bash
   cd /path/to/infrastructure
   ```

2. OpenTofu를 사용하여 인프라를 배포합니다 (아직 배포하지 않은 경우).

   ```bash
   cd environments/dev
   tofu init
   tofu apply
   ```

3. 스크립트에 실행 권한을 부여합니다.

   ```bash
   chmod +x scripts/deploy.sh
   chmod +x scripts/upload_env.sh
   ```

### 배포 방법

#### 기본 배포

스크립트를 사용하여 JAR 파일을 S3에 업로드하고 EC2 인스턴스에서 애플리케이션을 재시작합니다:

```bash
./scripts/deploy.sh dev ../backend/build/libs/application.jar
```

#### 환경 변수와 함께 배포

애플리케이션 환경 변수를 업데이트하면서 배포하려면:

```bash
./scripts/deploy.sh dev ../backend/build/libs/application.jar ./env/dev.env
```

#### 환경 변수만 업데이트

애플리케이션 재배포 없이 환경 변수만 업데이트하려면:

```bash
./scripts/upload_env.sh dev ./env/dev.env
```

### 환경 변수 파일 형식

`env/dev.env` 파일은 다음과 같은 형식으로 작성합니다:

```
DATABASE_URL=jdbc:postgresql://your-db-host:5432/dbname
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
JWT_SECRET=your-jwt-secret
# 기타 환경 변수...
```

비밀번호, 시크릿, 키, 토큰, 자격증명 관련 변수는 자동으로 암호화되어 SSM Parameter Store에 저장됩니다.

### 구성 요소

이 배포 방식은 다음과 같은 구성 요소를 포함합니다:

1. **S3 버킷**: 스프링부트 JAR 파일을 저장합니다.
2. **IAM 역할**: EC2 인스턴스가 S3 버킷에 접근하고 SSM Parameter Store에서 환경 변수를 읽을 수 있도록 권한을 부여합니다.
3. **EC2 인스턴스**: S3에서 JAR 파일을 다운로드하고 실행합니다.
4. **User Data 스크립트**: EC2 인스턴스 시작 시 필요한 소프트웨어를 설치하고 JAR 파일을 다운로드합니다.
5. **SSM Parameter Store**: 환경 변수를 안전하게 저장하고 관리합니다.
6. **배포 스크립트**: 새 버전의 JAR 파일을 S3에 업로드하고 EC2 인스턴스의 애플리케이션을 재시작합니다.

### 작동 방식

1. **배포 스크립트 실행**: `deploy.sh` 스크립트는 JAR 파일을 S3 버킷에 업로드합니다.
2. **환경 변수 업로드**: 환경 변수 파일이 제공된 경우 `upload_env.sh` 스크립트가 실행되어 SSM Parameter Store에 환경 변수를 저장합니다.
3. **EC2 인스턴스 업데이트**: AWS SSM Run Command를 사용하여 모든 EC2 인스턴스에 다음 명령을 전송합니다:
   - S3에서 새 JAR 파일 다운로드
   - 파일 권한 설정
   - 환경 변수 서비스 재시작 (load-env-vars.service)
   - 스프링부트 애플리케이션 재시작 (springboot.service)
4. **애플리케이션 환경 변수 로드**: EC2 인스턴스는 SSM Parameter Store에서 환경 변수를 로드하여 `/opt/app/application.env` 파일에 저장합니다.
5. **애플리케이션 실행**: 스프링부트 애플리케이션은 환경 변수 파일을 사용하여 실행됩니다.

### 로깅 및 디렉토리 구조

- **애플리케이션 디렉토리**: `/opt/app/`
- **JAR 파일 위치**: `/opt/app/application.jar`
- **환경 변수 파일**: `/opt/app/application.env`
- **로그 디렉토리**: `/opt/app/logs/`
  - 애플리케이션 로그 파일: `/opt/app/logs/amoroso.log`

EC2 인스턴스의 user-data 스크립트는 자동으로 로그 디렉토리를 생성하고 적절한 권한을 설정합니다.

### 주의사항

- 프로덕션 환경에서는 더 안전한 배포 방식(예: CI/CD 파이프라인)을 사용하는 것이 좋습니다.
- AWS SSM Parameter Store는 SecureString 형태로 민감한 정보를 암호화하여 저장합니다. "password", "secret", "key", "token", "credential" 키워드가 포함된 변수는 자동으로 암호화됩니다.
- 대규모 배포에서는 블루/그린 배포나 롤링 업데이트와 같은 더 고급 배포 전략을 고려하세요.
- Auto Scaling Group을 사용하는 경우, 배포 스크립트는 모든 현재 인스턴스에 변경 사항을 적용합니다.
