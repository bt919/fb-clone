import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

import { awsConfig } from "@/config/aws.config";

type preSignedParams = {
  s3ObjectKey: string; // short uuid
  expiresIn: number; // valid time for url (in seconds)
};

export const getPresignedPutUrl = ({
  s3ObjectKey,
  expiresIn,
}: preSignedParams) => {
  const dateLessThan = new Date(Date.now() + expiresIn * 1000).toString();

  const signedUrl = getSignedUrl({
    url: `${awsConfig.cloudfrontUrl}/${s3ObjectKey}`,
    keyPairId: awsConfig.keyPairId,
    dateLessThan: dateLessThan,
    privateKey: awsConfig.privateKey,
  });

  return signedUrl;
};
