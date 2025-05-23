# 추가 태그 동적 활성화

# 추가 AWS 정의 태그 활성화 - 이미 리소스에 적용된 태그만 포함
# 현재는 비활성화 - 리소스가 생성된 후 활성화 예정
# resource "aws_ce_cost_allocation_tag" "additional_aws_tags" {
#   for_each = toset(var.additional_aws_tags)
#   
#   tag_key   = each.value
#   status    = "Active"
# }
