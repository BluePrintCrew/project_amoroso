# 🚀 GitHub Actions 배포 시스템 테스트

이 파일은 GitHub Actions 자동 배포 시스템을 테스트하기 위해 생성되었습니다.

## 테스트 목적
- backend/ 폴더 변경 감지 확인
- 자동 빌드 및 배포 프로세스 검증
- S3 업로드 및 EC2 재시작 확인

## 배포 시스템 정보
- **환경**: Dev
- **브랜치**: feature/github-actions-deployment
- **AWS 계정**: 375004071350
- **IAM 역할**: github-actions-role-dev

## 변경 이력
- **2025-06-30 09:16:00**: 초기 테스트
- **2025-06-30 10:07:00**: Environment Variables 문제 해결 후 재테스트
  - `dev` Environment에 `AWS_ACCOUNT_ID` Variable 추가
  - Repository Variables → Environment Variables 스코프 문제 해결