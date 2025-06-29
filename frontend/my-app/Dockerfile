# 개발 환경용 Dockerfile
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 사용자 권한 설정 (권한 문제 방지)
USER root

# 의존성 파일들 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production=false

# 소스코드는 볼륨 마운트로 처리
# 기본 구조만 생성
RUN mkdir -p src public

# React 개발 서버 환경 변수
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV FAST_REFRESH=true

# 포트 노출
EXPOSE 3000

# 개발 서버 실행 (핫리로드 지원)
CMD ["npm", "start"]