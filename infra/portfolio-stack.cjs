/* oxlint-disable typescript/no-require-imports -- CDK CLIからCommonJSとして実行する */
const { RemovalPolicy, Stack } = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");

const environment = { account: "078072735979", region: "ap-northeast-1" };
const certificateArn = "arn:aws:acm:us-east-1:078072735979:certificate/36626f96-fa83-4760-a30c-1dbb88f7179f";
const cachePolicyId = "658327ea-f89d-4fab-a63d-7e88639e58f6";

// L1で実測値を明示し、L2の既定値による設定変更を避ける。
class PortfolioStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const siteBucket = new s3.CfnBucket(this, "SiteBucket", {
      bucketName: "www.hasutosasaki.com",
      ...bucketSettings(),
    });
    const redirectBucket = new s3.CfnBucket(this, "RedirectBucket", {
      bucketName: "hasutosasaki.com",
      ...bucketSettings(),
      websiteConfiguration: {
        redirectAllRequestsTo: { hostName: "www.hasutosasaki.com", protocol: "https" },
      },
    });
    const originAccessControl = new cloudfront.CfnOriginAccessControl(this, "SiteOriginAccessControl", {
      originAccessControlConfig: {
        name: "www.hasutosasaki.com.s3.ap-northeast-1.amazonaws.com",
        originAccessControlOriginType: "s3",
        signingBehavior: "always",
        signingProtocol: "sigv4",
      },
    });

    // Origin IDは以前のバケット名を含むが、現行の識別子を維持する。
    const siteOriginId = "hasuto.dev-site.s3.ap-northeast-1.amazonaws.com";
    const siteDistribution = new cloudfront.CfnDistribution(this, "SiteDistribution", {
      distributionConfig: {
        ...distributionSettings(),
        aliases: ["www.hasutosasaki.com"],
        defaultRootObject: "index.html",
        httpVersion: "http2and3",
        origins: [{
          id: siteOriginId,
          domainName: siteBucket.attrRegionalDomainName,
          originPath: "",
          connectionAttempts: 3,
          connectionTimeout: 10,
          originShield: { enabled: false },
          originAccessControlId: originAccessControl.attrId,
          s3OriginConfig: { originAccessIdentity: "", originReadTimeout: 30 },
        }],
        defaultCacheBehavior: cacheBehavior(siteOriginId),
      },
    });

    const redirectOriginId = "hasutosasaki.com.s3-website-ap-northeast-1.amazonaws.com";
    const redirectDistribution = new cloudfront.CfnDistribution(this, "RedirectDistribution", {
      distributionConfig: {
        ...distributionSettings(),
        aliases: ["hasutosasaki.com"],
        defaultRootObject: "",
        httpVersion: "http2",
        origins: [{
          id: redirectOriginId,
          domainName: redirectOriginId,
          originPath: "",
          connectionAttempts: 3,
          connectionTimeout: 10,
          originShield: { enabled: false },
          originAccessControlId: "",
          customOriginConfig: {
            httpPort: 80,
            httpsPort: 443,
            originProtocolPolicy: "http-only",
            originSslProtocols: ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"],
            originReadTimeout: 30,
            originKeepaliveTimeout: 5,
          },
        }],
        defaultCacheBehavior: cacheBehavior(redirectOriginId),
      },
    });
    const bucketPolicy = new s3.CfnBucketPolicy(this, "SiteBucketPolicy", {
      bucket: siteBucket.ref,
      policyDocument: {
        Version: "2008-10-17",
        Id: "PolicyForCloudFrontPrivateContent",
        Statement: [{
          Sid: "AllowCloudFrontServicePrincipal",
          Effect: "Allow",
          Principal: { Service: "cloudfront.amazonaws.com" },
          Action: "s3:GetObject",
          Resource: `${siteBucket.attrArn}/*`,
          Condition: {
            StringEquals: {
              "AWS:SourceArn": this.formatArn({
                service: "cloudfront", region: "", resource: "distribution",
                resourceName: siteDistribution.ref,
              }),
            },
          },
        }],
      },
    });

    // 取り込み時と以後の変更で使用する論理IDを固定する。
    for (const [logicalId, resource] of Object.entries({
      SiteBucket: siteBucket,
      RedirectBucket: redirectBucket,
      SiteOriginAccessControl: originAccessControl,
      SiteDistribution: siteDistribution,
      RedirectDistribution: redirectDistribution,
      SiteBucketPolicy: bucketPolicy,
    })) {
      resource.overrideLogicalId(logicalId);
      resource.applyRemovalPolicy(RemovalPolicy.RETAIN);
    }
  }
}

function bucketSettings() {
  return {
    publicAccessBlockConfiguration: {
      blockPublicAcls: true,
      ignorePublicAcls: true,
      blockPublicPolicy: true,
      restrictPublicBuckets: true,
    },
    ownershipControls: { rules: [{ objectOwnership: "BucketOwnerEnforced" }] },
    bucketEncryption: {
      serverSideEncryptionConfiguration: [{
        serverSideEncryptionByDefault: { sseAlgorithm: "AES256" },
        bucketKeyEnabled: true,
        blockedEncryptionTypes: { encryptionType: ["SSE-C"] },
      }],
    },
  };
}

function distributionSettings() {
  return {
    enabled: true,
    ipv6Enabled: true,
    comment: "",
    priceClass: "PriceClass_All",
    staging: false,
    continuousDeploymentPolicyId: "",
    webAclId: "",
    restrictions: { geoRestriction: { restrictionType: "none" } },
    viewerCertificate: {
      acmCertificateArn: certificateArn,
      sslSupportMethod: "sni-only",
      minimumProtocolVersion: "TLSv1.2_2021",
    },
  };
}

function cacheBehavior(originId) {
  return {
    targetOriginId: originId,
    viewerProtocolPolicy: "allow-all",
    allowedMethods: ["HEAD", "GET"],
    cachedMethods: ["HEAD", "GET"],
    cachePolicyId,
    compress: true,
    smoothStreaming: false,
    fieldLevelEncryptionId: "",
    grpcConfig: { enabled: false },
  };
}

module.exports = { PortfolioStack, environment };
