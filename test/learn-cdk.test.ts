import "@aws-cdk/assert/jest";
import * as LearnCdk from "../lib/index";
import * as cdk from "@aws-cdk/core";
import * as s3 from '@aws-cdk/aws-s3';

const app = new cdk.App();
const stack = new LearnCdk.LearnCdkStack(app, 'MyTestStack');

test("Should have 2 buckets created", () => {
  expect(stack).toCountResources("AWS::S3::Bucket", 2);
});

test("Buckets should not have public access", () => {
  expect(stack).toHaveResource("AWS::S3::Bucket", {
    BucketName: "videos-bucket-086241b9-c21c-429e-af3d-3c98fff41ae6",
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true
    }
  });

  expect(stack).toHaveResource("AWS::S3::Bucket", {
    BucketName: "rekognition-results-bucket-086241b9-c21c-429e-af3d-3c98fff41ae6",
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true
    }
  });
});
