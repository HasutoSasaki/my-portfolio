# 既存ポートフォリオのCDK管理

2026-09-27 21:43 JSTに、AWS CLIの`sandbox`プロファイルで現行構成を確認した。
ユーザー承認後、同日22:00 JSTに既存6リソースの取り込みが完了した（`IMPORT_COMPLETE`）。
取り込み後の設定比較、公開URL、ドリフト検出、CDKの差分確認を完了した。結果は[import-result.json](./import-result.json)に保持する。

## 現行構成

| 用途 | ドメイン | CloudFront ID | S3バケット |
| --- | --- | --- | --- |
| サイト本体 | `www.hasutosasaki.com` | `E1DZXZ1TJCQU0K` | `www.hasutosasaki.com` |
| wwwへの転送 | `hasutosasaki.com` | `E2WBVFFV91A2DU` | `hasutosasaki.com` |

- AWSアカウント: `078072735979`、S3リージョン: `ap-northeast-1`。
- `https://www.hasutosasaki.com/` は200、`https://hasutosasaki.com/` は`https://www.hasutosasaki.com/`への301。
- サイト本体はS3のRESTエンドポイントをOAC `E163VYBXXAXG8G`で参照する。S3のパブリックアクセスブロックは4項目すべて有効で、バケットポリシーは本体のCloudFrontからの`GetObject`だけを許可する。
- 転送用バケットはS3ウェブサイト設定で`https://www.hasutosasaki.com`へ転送する。CloudFrontはこのウェブサイトエンドポイントへHTTPで接続する。転送用バケットのパブリックアクセスブロックもすべて有効、バケットポリシーはない。301応答を実測済み。
- 両バケットはAES256暗号化、`BucketKeyEnabled: true`、SSE-Cブロック、`BucketOwnerEnforced`。バージョニング、CORS、ライフサイクル、アクセスログの設定はない。取り込み時にCloudFormationの管理タグだけが追加された。
- 両配信のViewerProtocolPolicyは`allow-all`。HTTPの本体URLも200で、HTTPSへの自動転送はない。
- キャッシュは両配信ともAWS管理の`CachingOptimized`。最小1秒・既定86,400秒・最大31,536,000秒、Cookie・クエリ文字列はキャッシュキーに含まれない。`/_next/static/*`専用の設定はない。
- 両配信ともGET/HEADのみ、圧縮・IPv6有効、価格クラスは全リージョン。追加のキャッシュ動作、カスタムエラー、エッジ関数、WAF、標準アクセスログはない。本体はHTTP/2・3、転送用はHTTP/2。
- 本体のルートオブジェクトは`index.html`。S3上の最終更新は2025-06-08、115,526バイトで、公開URLの応答も同じETag・サイズだった。
- アプリはNext.jsの静的エクスポート。既存CIはlint/buildのみ。自動公開ワークフローは別途追加したが、AWS認証の準備が済むまでは公開しない。`deploy.sh`はGit管理対象外で、手元にもないため、従来のアップロード手順・実行元は未確認。

実測値は[aws-inventory.json](./aws-inventory.json)に保持する。AWS認証コードやアクセスキーは含まない。

## 管理する範囲

既存の6リソースを、東京リージョンの`MyPortfolioSandbox`スタックへ取り込み済み。
L1を使用して現行値を明示し、既存の物理ID・バケット名・配信設定を維持する。
全リソースに`DeletionPolicy: Retain`と`UpdateReplacePolicy: Retain`を設定する。

| 論理ID | リソース種別 | 既存識別子 |
| --- | --- | --- |
| SiteBucket | S3 Bucket | `BucketName=www.hasutosasaki.com` |
| RedirectBucket | S3 Bucket | `BucketName=hasutosasaki.com` |
| SiteOriginAccessControl | CloudFront OAC | `Id=E163VYBXXAXG8G` |
| SiteDistribution | CloudFront Distribution | `Id=E1DZXZ1TJCQU0K` |
| RedirectDistribution | CloudFront Distribution | `Id=E2WBVFFV91A2DU` |
| SiteBucketPolicy | S3 BucketPolicy | `Bucket=www.hasutosasaki.com` |

識別子はAWSの`get-template-summary`でも確認済み。
CDK CLIが生成した対応表は[resource-mapping.json](./resource-mapping.json)、CloudFormation形式は[resources-to-import.json](./resources-to-import.json)。

以下は初回取り込みの対象に含めない。

- Route 53ゾーン`Z0395681XIKK9RSPZ6BR`と既存レコード。本体・転送用のA Aliasは現在のCloudFrontを参照している。AAAAレコードはない。
- us-east-1の共有ACM証明書`36626f96-fa83-4760-a30c-1dbb88f7179f`。両ドメインを含み、ステージング配信2件も利用している。既存ARNを参照する。
- ステージング配信`E1FR6WEFEJHY6F`、`E62688SIOC022`、その他のデモリソース。
- S3上のサイトファイル。取り込み時にビルド・アップロード・キャッシュ無効化を行わない。

CDKToolkitのbootstrapバージョンは30。取り込みに必要なバージョン12以上を満たす。
取り込み前にアカウントで有効な17リージョンのCloudFormationスタックを読み取り確認し、対象の既存識別子が他のスタックで管理されていないことを確認した。

## 完了結果と費用

- スタックは`IMPORT_COMPLETE`。6件すべて`Import`で、既存バケット名・配信ID・OAC IDを維持した。
- CloudFormationのドリフト検出は`IN_SYNC`、差分0件。対応する5リソースがすべて一致した。非対応のBucketPolicyはAPIで本文を比較して一致を確認した。
- `pnpm run diff`は差分0スタック、比較テストは4件すべて成功した。
- 両CloudFrontの配信設定、S3設定、バケットポリシー、DNS、`index.html`の内容識別情報を取り込み前後で比較し、一致を確認した。公開URLは本体200、転送用301で変更なし。
- 管理タグ以外の設定変更、新しいバケット・配信・KMSキー・ログ・計算リソースの作成は行っていない。DNSと共有証明書も変更していない。
- [CloudFormationのAWSリソース管理には追加料金がない](https://aws.amazon.com/cloudformation/pricing/)。既存S3・CloudFrontの料金設定も維持している。ただし、確認用リクエストと準備時に保存したテンプレート1件には通常のS3等の従量料金が適用される可能性があり、請求額の増加が厳密に0円とは保証していない。

取り込み時のAWS変更は現行構成を管理下に置くためのもの。サイトファイルの公開は行っていない。

## GitHub Actionsによるサイト公開

[deploy-site.yaml](../.github/workflows/deploy-site.yaml)はPRではビルドの検証だけを行い、`master`へのサイト関連のpush、または`master`からの手動実行で公開する。`infra/`・`.github/`・ルートREADMEだけのpushでは動かさず、不要なS3書き込みと無効化を避ける。依存関係のインストール・lint・静的ビルドをAWS権限のないジョブで行い、別ジョブでビルド成果物だけを受け取ってサイト用バケットへアップロードする。PRの実行にはAWS権限を渡さない。アップロード後に本体CloudFront配信の`/*`を無効化する。CDKスタックの自動deployではない。

安全のため、全Actionを確認済みのコミットSHAで固定し、GitHubトークン権限をジョブ単位に制限する。AWS認証は短期のOIDC認証だけを使用し、アクセスキーをGitHub Secretsへ保存しない。AWSロールの信頼条件はこのリポジトリの`master`ブランチに完全一致させる。権限はサイト用バケットの一覧・追加更新と、本体配信の無効化のみで、削除・IAM・CDK操作は許可しない。

`s3 sync`に`--delete`は付けない。ビルド結果にない既存オブジェクトを誤って削除しないためであり、古いファイルはS3に残る。公開ファイルの全件整理は、現在のバケット内容と出力の対応を確認した後に別途判断する。無効化は公開ごとに1パスを使用し、[CloudFrontの無料枠](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PayingForInvalidation.html)を超える場合は課金される。S3への書き込みや転送にも通常の従量料金がかかる。

### 初回設定（未実施）

2026-10-03時点ではAWS CLIの`sandbox`認証が期限切れで、IAM OIDCプロバイダーとロールの有無は未確認。GitHub Actionsの公開用変数も未設定。このPRのマージだけでは公開ワークフローは起動せず、設定前にサイト変更や手動実行で起動した場合は公開ジョブが明示的に失敗し、S3は変更しない。

1. `aws login --profile sandbox`後、`aws sts get-caller-identity --profile sandbox`が`078072735979`を返すことを確認する。IAMで`token.actions.githubusercontent.com`のOIDCプロバイダーと`sts.amazonaws.com`のaudienceを確認する。存在しない場合のみ、[GitHub公式手順](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)で作成する。
2. `my-portfolio-github-deploy`ロールを[信頼ポリシー](./github-actions-deploy-trust.json)で作成し、[権限ポリシー](./github-actions-deploy-policy.json)を付ける。既存の同名ロールがあれば、その信頼条件と権限を調べてから扱う。`sub`の形式は当該リポジトリのOIDC設定（現状`use_default: true`、`use_immutable_subject: false`）に合わせてある。設定変更時は信頼ポリシーも見直す。
3. GitHubの`master`ブランチは強制push・削除は禁止されているが、必須のPRレビューやCIチェックは未設定。意図しない公開を防ぐため、レビュー・CIを必須にする保護設定を検討し、運用可能な形で有効化する。
4. AWSロール・ブランチ保護を確認してから、リポジトリ変数`ENABLE_SITE_DEPLOY=true`を設定する。次のサイト関連の`master`へのpushから公開が動く。初回は`gh workflow run deploy-site.yaml --repo HasutoSasaki/my-portfolio --ref master`でも実行できる。公開ジョブの成功とS3の更新日時、公開URLの応答を確認する。

OIDCプロバイダーと同名ロールが未登録であることを確認した場合に限り、ロールは以下で作成できる。

```sh
cd infra
aws iam create-role --role-name my-portfolio-github-deploy \
  --assume-role-policy-document file://github-actions-deploy-trust.json --profile sandbox
aws iam put-role-policy --role-name my-portfolio-github-deploy \
  --policy-name MyPortfolioSiteDeploy \
  --policy-document file://github-actions-deploy-policy.json --profile sandbox
```

保護設定とロールを確認した後の有効化は`gh variable set ENABLE_SITE_DEPLOY --repo HasutoSasaki/my-portfolio --body true`。先に有効化しない。

AWS側のロール・プロバイダー作成、GitHub変数・ブランチ保護の変更、サイトファイルのアップロードはこのPRでは実行していない。

## ローカルの確認

アプリとは別のpnpmプロジェクトとして依存関係を固定している。Node.js 20以上を使用する。

```sh
cd infra
CI=true pnpm install --frozen-lockfile --ignore-scripts
pnpm test
pnpm exec cdk synth MyPortfolioSandbox --profile sandbox --lookups=false --quiet
```

比較テストは、取得したAWS設定と生成テンプレートのCloudFront・S3・OAC・バケットポリシーを比較する。
さらに取り込みID、対象が6リソースだけであること、Retain設定を確認する。
`synth`とAWSの`validate-template`は通過済み。

実測のバケットポリシーは`Version: 2008-10-17`で、CDKは2012-10-17への更新を勧める警告を出す。
初回取り込みでは実測の値を維持する。この警告はテンプレートの検証失敗ではない。

## 初回取り込みの実行記録（実行済み・再実行しない）

まずアカウントを確認する。`078072735979`以外なら進めない。
取り込み前に設定を再取得し、記録した構成と変わっていないことも確認する。
`app.cjs`はCDKが検出したアカウント・リージョンが異なる場合にエラーにする。

```sh
aws sts get-caller-identity --profile sandbox
pnpm test
pnpm exec cdk synth MyPortfolioSandbox --profile sandbox --lookups=false --quiet
pnpm run diff
```

初回のdiffでは、既存スタックがないため6リソースが追加として表示される。
通常の`cdk deploy`では既存リソースを取り込めないので、初回はIMPORT変更セットを使う。
今回は生成したCDKテンプレートをCloudFormationへ直接渡して取り込んだ。テンプレートは8,141バイトで、直接指定の上限51,200バイト以内。取り込み時の追加のS3アップロードは不要だった。

次のコマンドでIMPORT変更セットを作成した。この時点では取り込みは未実行。

```sh
aws cloudformation create-change-set --stack-name MyPortfolioSandbox \
  --change-set-name portfolio-import --change-set-type IMPORT \
  --template-body file://cdk.out/MyPortfolioSandbox.template.json \
  --resources-to-import file://resources-to-import.json \
  --region ap-northeast-1 --profile sandbox

aws cloudformation describe-change-set --stack-name MyPortfolioSandbox \
  --change-set-name portfolio-import --region ap-northeast-1 --profile sandbox \
  --query 'Changes[].ResourceChange.{Action:Action,Id:LogicalResourceId,Type:ResourceType}'
```

6件すべてが`Import`で、物理ID・種別が上の表と一致し、設定更新・削除・新規作成を含まないことを確認してから実行した。

```sh
aws cloudformation execute-change-set --stack-name MyPortfolioSandbox \
  --change-set-name portfolio-import --region ap-northeast-1 --profile sandbox

aws cloudformation wait stack-import-complete --stack-name MyPortfolioSandbox \
  --region ap-northeast-1 --profile sandbox
```

取り込み後に、スタックの物理IDが対応表と一致すること、公開URLの200/301、ドリフトを確認した。
BucketPolicyはドリフト検出非対応のため、`get-bucket-policy`で本文を別途比較した。
CloudFormationの取り込み処理はテンプレートと実リソースの設定一致を検証しない。
ドリフトが残る場合は、通常のdeployへ進まず原因を調べる。

## 今後の変更

まず`infra`で`pnpm test`、`pnpm run synth`、`pnpm run diff`を実行して差分を確認する。
CDKは同じ`MyPortfolioSandbox`スタック・論理IDを使用するため、通常のCDK管理を継続できる。
AWSへの設定変更は、その差分と費用影響を確認し、承認を得てから実行する。
スタックやリソースの削除は今回の承認に含まれない。Retainは物理リソースを保持する設定であり、設定更新による影響すべてを防ぐものではない。

## この作業で実行したAWS操作

- AWSログインと本人確認、インフラ設定・DNS・証明書・スタックの読み取り、公開URLのHEADリクエスト。
- テンプレート検証と取り込み識別子の読み取り。
- CDKの`--record-resource-mapping`で対応表をローカルに生成。この際、CDK CLIがbootstrap用S3バケットへ生成テンプレート1件をアップロードした。
- ユーザー承認後に`MyPortfolioSandbox`スタックとIMPORT変更セットを作成し、既存6リソースを取り込んだ。CloudFormationの管理タグが追加された。
- 取り込み後に設定比較、公開URL、ドリフト検出、CDKの差分確認を実行した。
- 取り込み時にサイトファイルのアップロード、キャッシュ無効化、DNS・証明書・配信設定の変更は行っていない。

## 別変更として検討する項目

HTTPからHTTPSへの転送、HTMLと`/_next/static/*`のキャッシュ分離、ポリシー言語版の更新、不要なステージング配信の整理、サイト公開手順の整備は、現行構成の取り込み後に個別に判断する。

## AWS公式資料

- [CDK import](https://docs.aws.amazon.com/cdk/v2/guide/ref-cli-cmd-import.html)
- [CloudFormation importの検証範囲と制約](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/import-resources-manually.html)
- [リソースごとのimport・ドリフト検出対応](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resource-import-supported-resources.html)
- [S3暗号化設定](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-s3-bucket-serversideencryptionrule.html)
- [CloudFormation変更セット作成](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/create-change-set.html)
- [CloudFormation料金](https://aws.amazon.com/cloudformation/pricing/)
- [GitHub ActionsのOIDCによるAWS認証](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)
- [GitHub Actionsの安全な利用](https://docs.github.com/en/actions/reference/security/secure-use)
- [AWS CLIのS3同期](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html)
