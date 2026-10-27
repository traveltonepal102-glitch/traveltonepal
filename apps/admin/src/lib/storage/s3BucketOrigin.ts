/**
 * The https address of an S3 bucket, as in its upload links. Its own file so the proxy (Content-Security-Policy)
 * doesn't load the AWS SDK.
 */
export const s3BucketOrigin = (region: string, bucket: string) => `https://${bucket}.s3.${region}.amazonaws.com`;
