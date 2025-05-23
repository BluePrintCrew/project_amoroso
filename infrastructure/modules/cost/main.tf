# 비용 할당 태그 활성화
# AWS Cost Explorer API에서 특정 태그를 비용 할당 태그로 활성화

# 사용자 정의 태그 활성화 - 이미 리소스에 적용된 태그만 포함
resource "aws_ce_cost_allocation_tag" "environment_tag" {
  tag_key   = "Environment"
  status    = "Active"
}

resource "aws_ce_cost_allocation_tag" "name_tag" {
  tag_key   = "Name"
  status    = "Active"
}

resource "aws_ce_cost_allocation_tag" "terraform_tag" {
  tag_key   = "Terraform"
  status    = "Active"
}

# AWS 생성 태그 활성화
resource "aws_ce_cost_allocation_tag" "created_by" {
  tag_key   = "aws:createdBy"
  status    = "Active"
}

# AWS 생성 태그를 조건부로 활성화
# 해당 리소스가 생성된 후에만 태그 활성화를 시도
# 이 방식으로 리소스가 없을 때 오류를 방지할 수 있음

# CloudFormation 태그는 현재 새 계정에서 사용하지 않으므로 비활성화
# resource "aws_ce_cost_allocation_tag" "cloudformation_tag" {
#   tag_key   = "aws:cloudformation:stack-name"
#   status    = "Active"
# }

# Auto Scaling Group 태그는 리소스가 생성된 후에 활성화할 예정
# resource "aws_ce_cost_allocation_tag" "autoscaling_tag" {
#   tag_key   = "aws:autoscaling:groupName"
#   status    = "Active"
# }
