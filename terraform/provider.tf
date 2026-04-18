terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # オプション: Terraform の状態を S3 に保存する場合
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "portfolio/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region
}

# CloudFront で ACM 証明書を使用する場合、us-east-1 リージョンが必要
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
