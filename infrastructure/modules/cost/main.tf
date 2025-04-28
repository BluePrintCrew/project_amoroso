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

resource "aws_ce_cost_allocation_tag" "cloudformation_tag" {
  tag_key   = "aws:cloudformation:stack-name"
  status    = "Active"
}

resource "aws_ce_cost_allocation_tag" "autoscaling_tag" {
  tag_key   = "aws:autoscaling:groupName"
  status    = "Active"
}
