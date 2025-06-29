# 개발 환경용 Dockerfile
FROM gradle:8-jdk21

# 작업 디렉토리 설정
WORKDIR /app

# curl 설치 (헬스체크용)
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 의존성 파일들 복사 (캐시 최적화)
COPY build.gradle settings.gradle ./
COPY gradle/ ./gradle/

# 의존성 다운로드 (레이어 캐시 활용)
RUN gradle dependencies --no-daemon

# 소스코드는 볼륨 마운트로 처리하므로 여기서는 복사하지 않음
# 대신 기본 소스 구조만 생성
RUN mkdir -p src/main/java src/main/resources src/test/java

# 이미지 저장 디렉토리 생성
RUN mkdir -p images review-images

# Gradle daemon 활성화 및 개발 환경 최적화
ENV GRADLE_OPTS="-Dorg.gradle.daemon=true -Dorg.gradle.parallel=true -Dorg.gradle.configureondemand=true"

# 포트 노출
EXPOSE 8080

# 개발 서버 실행 (핫리로드 지원)
CMD ["gradle", "bootRun", "--no-daemon", "--continuous"]