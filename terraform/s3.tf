# S3 バケット名をユニークにするためのランダムな文字列
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# S3 バケット（静的ウェブサイトホスティング用）
resource "aws_s3_bucket" "website" {
  bucket = "${var.project_name}-${var.environment}-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "${var.project_name}-${var.environment}"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# S3 バケットのパブリックアクセスブロック設定
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 バケットポリシー（CloudFront からのアクセスを許可）
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOAC"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.website.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.website.arn
          }
        }
      }
    ]
  })
}

# S3 バケットのバージョニング設定
resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id

  versioning_configuration {
    status = "Disabled"
  }
}

# S3 バケットのサーバーサイド暗号化設定
resource "aws_s3_bucket_server_side_encryption_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
