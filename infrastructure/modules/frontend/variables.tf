variable "environment" {
  description = "환경 (dev, prod 등)"
  type        = string
}

variable "repository" {
  description = "Github 리포지토리 URL"
  type        = string
  default     = "https://github.com/BluePrintCrew/project_amoroso"
}

variable "branch_name" {
  description = "Amplify 앱의 기본 브랜치 이름"
  type        = string
  default     = "develop"
}

variable "app_name" {
  description = "Amplify 앱 이름"
  type        = string
  default     = "project_amoroso"
}

variable "github_access_token" {
  description = "GitHub 액세스 토큰"
  type        = string
  sensitive   = true
}

variable "monorepo_app_root" {
  description = "모노레포 앱 루트 경로"
  type        = string
  default     = "frontend/my-app"
}

variable "domain_name" {
  description = "Amplify 앱에 연결할 도메인 이름"
  type        = string
  default     = "amoroso.blue"
}
