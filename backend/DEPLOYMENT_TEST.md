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
- **2025-06-30 10:15:00**: AWS 인증 사전 검증 Job 추가
  - `validate-aws-access` Job으로 빌드 전 AWS 권한 확인
  - 빌드 시간 낭비 방지 (실패 시 30초 내 조기 발견)
  - OIDC 인증, S3 버킷, ASG, SSM 권한 검증
- **2025-06-30 10:25:00**: OIDC Environment sub claim 문제 해결
  - IAM 신뢰 정책에 Environment 조건 추가
  - `repo:BluePrintCrew/project_amoroso:environment:dev` 허용
  - GitHub Actions Environment 사용 시 sub claim 형태 변경 대응
- **2025-06-30 10:30:00**: S3 버킷 조회 방식 변경
  - Terraform 출력 → AWS API 직접 조회로 변경
  - GitHub Actions에서 Terraform 상태 파일 없는 문제 해결
  - 패턴 매칭으로 환경별 S3 버킷 자동 검색