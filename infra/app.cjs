/* oxlint-disable typescript/no-require-imports -- CDK CLIからCommonJSとして実行する */
const { App } = require("aws-cdk-lib");
const { PortfolioStack, environment } = require("./portfolio-stack.cjs");

if (process.env.CDK_DEFAULT_ACCOUNT && process.env.CDK_DEFAULT_ACCOUNT !== environment.account) {
  throw new Error(`sandboxアカウント ${environment.account} で実行してください。`);
}
if (process.env.CDK_DEFAULT_REGION && process.env.CDK_DEFAULT_REGION !== environment.region) {
  throw new Error(`リージョン ${environment.region} で実行してください。`);
}

const app = new App();
new PortfolioStack(app, "MyPortfolioSandbox", {
  env: environment,
  description: "Existing S3 and CloudFront portfolio resources in sandbox",
  analyticsReporting: false,
});
