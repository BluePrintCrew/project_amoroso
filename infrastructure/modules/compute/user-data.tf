# 이 파일은 사용자 데이터 스크립트 관련 설정을 관리합니다.
#
# 템플릿 파일 위치: templates/user-data.sh.tpl
# 이 파일은 cloud-init이 사용하는 사용자 데이터 스크립트를 정의합니다.
#
# 중요: shebang 라인(#!/bin/bash)은 반드시 파일의 처음에 있어야 하며,
# 들여쓰기가 없어야 합니다. 그렇지 않으면 cloud-init이 스크립트를 인식하지 못할 수 있습니다.

# 로컬 변수를 사용하는 분리된 접근 방법을 구현할 수도 있습니다:
#
# locals {
#   user_data = templatefile("${path.module}/templates/user-data.sh.tpl", {
#     environment    = var.environment
#     s3_bucket_name = var.s3_bucket_name
#     jar_file_key   = var.jar_file_key
#     java_opts      = var.java_opts
#   })
# }
#
# 사용 예:
# resource "aws_launch_template" "example" {
#   user_data = base64encode(local.user_data)
# }
