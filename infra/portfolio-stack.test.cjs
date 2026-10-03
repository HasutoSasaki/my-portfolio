/* oxlint-disable typescript/no-require-imports -- Node.jsの組み込みテストでCommonJSを使用する */
const assert = require("node:assert/strict");
const { test } = require("node:test");
const { App } = require("aws-cdk-lib");
const { Template } = require("aws-cdk-lib/assertions");
const { PortfolioStack, environment } = require("./portfolio-stack.cjs");
const inventory = require("./aws-inventory.json");
const imports = require("./resources-to-import.json");
const resourceMapping = require("./resource-mapping.json");

const stack = new PortfolioStack(new App(), "MyPortfolioSandbox", {
  env: environment, analyticsReporting: false,
});
const template = Template.fromStack(stack).toJSON();

function resolve(value) {
  if (Array.isArray(value)) return value.map(resolve);
  if (value === null || typeof value !== "object") return value;
  if (value.Ref) {
    if (value.Ref === "AWS::Partition") return "aws";
    if (value.Ref === "AWS::AccountId") return inventory.account;
    const entry = imports.find((resource) => resource.LogicalResourceId === value.Ref);
    assert.ok(entry, `未知の参照: ${value.Ref}`);
    return Object.values(entry.ResourceIdentifier)[0];
  }
  if (value["Fn::GetAtt"]) {
    const [id, attribute] = value["Fn::GetAtt"];
    const entry = imports.find((resource) => resource.LogicalResourceId === id);
    assert.ok(entry, `未知の属性参照: ${id}`);
    const physicalId = Object.values(entry.ResourceIdentifier)[0];
    if (attribute === "Id") return physicalId;
    if (attribute === "Arn") return `arn:aws:s3:::${physicalId}`;
    if (attribute === "RegionalDomainName") return `${physicalId}.s3.${inventory.region}.amazonaws.com`;
    assert.fail(`未知の属性: ${attribute}`);
  }
  if (value["Fn::Join"]) {
    const [separator, parts] = value["Fn::Join"];
    return parts.map(resolve).join(separator);
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item)]));
}

// AWS APIとCloudFormationの表記差だけを変換する。
function distributionProperties(observed) {
  const config = structuredClone(observed.DistributionConfig);
  delete config.CallerReference;
  config.Aliases = config.Aliases.Items ?? [];
  config.IPV6Enabled = config.IsIPV6Enabled;
  delete config.IsIPV6Enabled;
  for (const key of ["OriginGroups", "CacheBehaviors", "CustomErrorResponses"]) {
    assert.equal(config[key].Quantity, 0);
    delete config[key];
  }
  config.Origins = config.Origins.Items.map((origin) => {
    assert.equal(origin.CustomHeaders.Quantity, 0);
    delete origin.CustomHeaders;
    if (origin.CustomOriginConfig) {
      const custom = origin.CustomOriginConfig;
      custom.OriginSSLProtocols = custom.OriginSslProtocols.Items;
      delete custom.OriginSslProtocols;
    }
    return origin;
  });
  const behavior = config.DefaultCacheBehavior;
  behavior.CachedMethods = behavior.AllowedMethods.CachedMethods.Items;
  behavior.AllowedMethods = behavior.AllowedMethods.Items;
  for (const key of ["TrustedSigners", "TrustedKeyGroups", "LambdaFunctionAssociations", "FunctionAssociations"]) {
    assert.equal(behavior[key].Quantity, 0);
    delete behavior[key];
  }
  assert.equal(config.Logging.Enabled, false);
  delete config.Logging;
  delete config.Restrictions.GeoRestriction.Quantity;
  config.ViewerCertificate = {
    AcmCertificateArn: config.ViewerCertificate.ACMCertificateArn,
    MinimumProtocolVersion: config.ViewerCertificate.MinimumProtocolVersion,
    SslSupportMethod: config.ViewerCertificate.SSLSupportMethod,
  };
  return config;
}

test("CloudFrontの配信設定がAWSで確認した設定と一致する", () => {
  for (const [id, observed] of [
    ["SiteDistribution", inventory.siteDistribution],
    ["RedirectDistribution", inventory.redirectDistribution],
  ]) {
    assert.deepEqual(resolve(template.Resources[id].Properties.DistributionConfig), distributionProperties(observed));
  }
});

test("S3の保護設定とルートドメインの転送設定が維持される", () => {
  for (const [id, observed] of [["SiteBucket", inventory.siteBucket], ["RedirectBucket", inventory.redirectBucket]]) {
    const properties = resolve(template.Resources[id].Properties);
    const expected = {
      BucketName: observed.name,
      PublicAccessBlockConfiguration: observed.publicAccessBlock,
      OwnershipControls: observed.ownership,
      BucketEncryption: {
        ServerSideEncryptionConfiguration: observed.encryption.Rules.map(({ ApplyServerSideEncryptionByDefault, ...rule }) => ({
          ...rule, ServerSideEncryptionByDefault: ApplyServerSideEncryptionByDefault,
        })),
      },
    };
    if (observed.website) expected.WebsiteConfiguration = observed.website;
    assert.deepEqual(properties, expected);
  }
});

test("OACとサイトバケットのアクセス条件が維持される", () => {
  assert.deepEqual(template.Resources.SiteOriginAccessControl.Properties.OriginAccessControlConfig, inventory.originAccessControl.OriginAccessControlConfig);
  assert.deepEqual(resolve(template.Resources.SiteBucketPolicy.Properties), {
    Bucket: inventory.siteBucket.name, PolicyDocument: inventory.siteBucket.policy,
  });
});

test("取り込む6リソースが保持されDNSと共有証明書は作成されない", () => {
  assert.deepEqual(Object.keys(template.Resources).sort(), imports.map((resource) => resource.LogicalResourceId).sort());
  for (const entry of imports) {
    const resource = template.Resources[entry.LogicalResourceId];
    assert.equal(resource.Type, entry.ResourceType);
    assert.equal(resource.DeletionPolicy, "Retain");
    assert.equal(resource.UpdateReplacePolicy, "Retain");
    assert.deepEqual(resourceMapping[entry.LogicalResourceId], entry.ResourceIdentifier);
  }
  assert.equal(template.Resources.SiteBucketPolicy.Properties.Bucket.Ref, "SiteBucket");
  assert.deepEqual(template.Resources.SiteDistribution.Properties.DistributionConfig.Origins[0].OriginAccessControlId, {
    "Fn::GetAtt": ["SiteOriginAccessControl", "Id"],
  });
});
