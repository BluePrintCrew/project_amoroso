# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 아키텍처 개요

Amoroso는 가구 전자상거래 플랫폼으로 다음 구조로 구성:

- **Frontend**: React 19 (포트 3000)
- **Backend**: Spring Boot 3.4.1 + Java 21 (포트 8080)
- **Database**: MySQL 8 + Redis
- **Infrastructure**: Terraform (OpenTofu) AWS 배포
- **결제**: PortOne(구 아임포트) 통합

## 개발 환경 명령어

### Backend (Spring Boot)
```bash
# backend/AmorosoBackend 디렉토리에서 실행
./gradlew build          # 프로젝트 빌드
./gradlew test           # 테스트 실행  
./gradlew bootRun        # 개발 서버 실행 (8080 포트)
./gradlew clean          # 빌드 결과물 정리
```

### Frontend (React)
```bash
# frontend/my-app 디렉토리에서 실행
npm install             # 의존성 설치
npm start               # 개발 서버 실행 (3000 포트)
npm run build          # 프로덕션 빌드
npm test               # 테스트 실행 (Jest + React Testing Library)
npm test -- --watchAll # 테스트 감시 모드
```

## 핵심 기능 모듈

### 인증 시스템
- OAuth2 (구글, 카카오, 네이버) + JWT 토큰
- 관련 파일: `security/`, `OAuth2SuccessHandler.java`, `JwtProvider.java`

### 상품 관리
- 상품, 옵션, 추가옵션, 이미지 관리
- 관련 파일: `product/` 패키지, `ProductController.java`

### 주문/결제 시스템  
- 장바구니 → 주문 → PortOne 결제 연동
- 관련 파일: `OrderController.java`, `PaymentController.java`, `CartItemController.java`

### 리뷰 시스템
- 상품 리뷰 + 이미지 업로드
- 관련 파일: `review/` 패키지

## 환경 설정

### 필수 환경 변수
백엔드 실행 시 다음 환경 변수들이 필요:
- `JWT_SECRET`: JWT 토큰 시크릿
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: 구글 OAuth2
- `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`: 카카오 OAuth2  
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`: 네이버 OAuth2
- `BUSINESS_VALIDATION_API_KEY`: 사업자 검증 API
- `ECOMMERCE_API_KEY`: 전자상거래 API

### 프로파일별 설정
- `application.yml`: 기본 설정 (로컬 개발)
- `application-dev.yml`: 개발 환경
- `application-prod.yml`: 프로덕션 환경
- `application-test.yml`: 테스트 환경

## 배포

### AWS 인프라 배포
```bash
# infrastructure/environments/dev 디렉토리에서
tofu init
tofu apply
```

### 애플리케이션 배포
```bash
# infrastructure/scripts 디렉토리에서 실행
chmod +x deploy.sh upload_env.sh  # 실행 권한 부여

# 기본 배포
./deploy.sh dev ../backend/build/libs/application.jar

# 환경 변수와 함께 배포
./deploy.sh dev ../backend/build/libs/application.jar ./env/dev.env

# 환경 변수만 업데이트
./upload_env.sh dev ./env/dev.env
```

### 배포 스크립트 동작 방식
- JAR 파일을 S3 버킷에 업로드
- SSM Run Command로 모든 EC2 인스턴스에 배포 명령 전송
- 환경 변수는 SSM Parameter Store에 암호화 저장
- 애플리케이션 로그: `/opt/app/logs/amoroso.log`

## 데이터베이스

### 로컬 개발
- MySQL: localhost:3306/amoroso (root/1234)
- Redis: localhost:6379
- H2: 테스트용 인메모리 DB

### 테이블 구조
주요 엔티티: User, Product, Order, Payment, Review, CartItem, Coupon
JPA `ddl-auto: create`로 스키마 자동 생성

## 주요 기술 스택

### Backend
- Spring Security + OAuth2
- Spring Data JPA + MySQL
- Redis (세션 관리)
- Swagger/OpenAPI 3
- Lombok
- JUnit 5 + Mockito

### Frontend  
- React Router DOM 7.1.1
- Axios (API 통신)
- React Toastify (알림)
- Recharts (차트)
- JWT Decode
- React Slick (캐러셀)
- PortOne Browser SDK (결제)

## 파일 업로드

이미지 파일은 로컬 디렉토리에 저장:
- 상품 이미지: `./images`
- 리뷰 이미지: `./review-images`

## 개발 환경 설정

### 사전 요구사항
- Java 21
- Node.js 18+
- MySQL 8.0
- Redis 6.0+
- AWS CLI (배포 시)
- OpenTofu (인프라 배포 시)

### 로컬 개발 환경 실행
1. 백엔드 실행:
   ```bash
   cd backend/AmorosoBackend
   ./gradlew bootRun
   ```

2. 프론트엔드 실행:
   ```bash
   cd frontend/my-app
   npm install
   npm start
   ```

### 테스트 실행
- 백엔드 테스트: `./gradlew test`
- 프론트엔드 테스트: `npm test`
- 특정 테스트 클래스: `./gradlew test --tests "클래스명"`