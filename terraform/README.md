# Terraform 設定 - Portfolio サイトホスティング

このディレクトリには、AWS S3 と CloudFront を使用した静的サイトホスティングの Terraform 設定が含まれています。

## 構成

以下の AWS リソースが作成されます：

- **S3 バケット**: 静的ウェブサイトファイルを保存
- **CloudFront ディストリビューション**: CDN によるコンテンツ配信
- **Origin Access Control (OAC)**: CloudFront から S3 への安全なアクセス
- **S3 バケットポリシー**: CloudFront からのアクセスのみ許可

## 前提条件

- [Terraform](https://www.terraform.io/downloads.html) (>= 1.0)
- AWS CLI の設定と認証情報
- AWS アカウント

## セットアップ

### 1. 変数ファイルの作成

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars` を編集して、プロジェクトに合わせた値を設定します。

### 2. Terraform の初期化

```bash
terraform init
```

### 3. 実行プランの確認

```bash
terraform plan
```

### 4. インフラのデプロイ

```bash
terraform apply
```

## カスタムドメインの使用（オプション）

カスタムドメインを使用する場合：

1. AWS Certificate Manager で SSL/TLS 証明書を作成（**us-east-1 リージョン**）
2. `terraform.tfvars` に以下を設定：
   ```hcl
   domain_name = "yourdomain.com"
   acm_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/xxxxx"
   ```
3. Route 53 または DNS プロバイダーで、ドメインを CloudFront ディストリビューションに向ける

## デプロイ手順

### Next.js アプリケーションのビルドと S3 へのアップロード

```bash
# プロジェクトルートで Next.js をビルド
cd ..
npm run build

# 静的ファイルを S3 にアップロード
# S3 バケット名は terraform output で確認できます
aws s3 sync out/ s3://$(terraform -chdir=terraform output -raw s3_bucket_name)/ --delete

# CloudFront のキャッシュを無効化
aws cloudfront create-invalidation \
  --distribution-id $(terraform -chdir=terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

### デプロイスクリプトの作成

`deploy.sh` を作成して、デプロイを自動化できます：

```bash
#!/bin/bash
set -e

echo "Building Next.js application..."
npm run build

echo "Syncing to S3..."
S3_BUCKET=$(terraform -chdir=terraform output -raw s3_bucket_name)
aws s3 sync out/ s3://${S3_BUCKET}/ --delete

echo "Creating CloudFront invalidation..."
DISTRIBUTION_ID=$(terraform -chdir=terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths "/*"

echo "Deployment complete!"
echo "Website URL: $(terraform -chdir=terraform output -raw website_url)"
```

## Terraform コマンド

### リソースの確認

```bash
terraform show
```

### 出力値の確認

```bash
terraform output
```

### 特定の出力値の取得

```bash
terraform output cloudfront_url
```

### リソースの削除

```bash
terraform destroy
```

## トラブルシューティング

### 403 Forbidden エラー

- CloudFront のキャッシュを無効化してください
- S3 バケットポリシーが正しく設定されているか確認してください

### Next.js の設定

`next.config.ts` で静的エクスポートを有効にする必要があります：

```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

## セキュリティ

- S3 バケットは CloudFront 経由でのみアクセス可能（OAC 使用）
- すべての HTTP リクエストは HTTPS にリダイレクトされます
- サーバーサイド暗号化（AES256）が有効

## コスト最適化

- `price_class` を調整して、必要な地域のみで配信
- CloudFront のキャッシュ設定を最適化
- S3 のライフサイクルポリシーで古いバージョンを削除

## 参考リンク

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
