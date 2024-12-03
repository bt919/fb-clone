import env from "env-var";

export const awsConfig = {
  privateKey: env.get("privateKey").required().asString(),
  keyPairId: env.get("keyPairId").required().asString(),
  cloudfrontUrl: env.get("cloudfrontUrl").required().asString(),
};
