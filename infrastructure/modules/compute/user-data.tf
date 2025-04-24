# 이 파일은 사용자 데이터 스크립트를 분리하는 용도입니다.
# 현재는 ec2.tf 내에 user_data 항목으로 포함되어 있습니다.
# 
# 복잡한 프로젝트에서는 별도 파일로 사용자 데이터 스크립트 템플릿을 분리할 수 있습니다.
# 예시:
#
# locals {
#   user_data_template = templatefile("${path.module}/templates/user-data.sh.tpl", {
#     environment    = var.environment
#     s3_bucket_name = var.s3_bucket_name
#     jar_file_key   = var.jar_file_key
#     java_opts      = var.java_opts
#   })
# }
