variable "aws_region" {
  description = "AWS リージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "プロジェクト名（S3バケット名のプレフィックスなどに使用）"
  type        = string
  default     = "my-portfolio"
}

variable "environment" {
  description = "環境名（dev, staging, prod など）"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "カスタムドメイン名（オプション）"
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "ACM 証明書の ARN（カスタムドメインを使用する場合）"
  type        = string
  default     = ""
}

variable "price_class" {
  description = "CloudFront の価格クラス"
  type        = string
  default     = "PriceClass_200"
}

variable "enable_ipv6" {
  description = "IPv6 を有効にするかどうか"
  type        = bool
  default     = true
}
