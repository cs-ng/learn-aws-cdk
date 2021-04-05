import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambdaNode from '@aws-cdk/aws-lambda-nodejs';
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';
import * as sns from '@aws-cdk/aws-sns';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
import { ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam';

export class LearnCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // custom IAM role to allow Rekognition to trigger SNS
    const rekognitionRole = new Role(this, 'RekognitionRole', {
      assumedBy: new ServicePrincipal('rekognition.amazonaws.com'),
      managedPolicies: [ ManagedPolicy.fromAwsManagedPolicyName('AmazonSNSFullAccess') ],
    });

    // S3 bucket to store videos
    const videosBucket = new s3.Bucket(this, 'VideosBucket', {
      bucketName: "videos-bucket-086241b9-c21c-429e-af3d-3c98fff41ae6",
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    })
    
    // S3 bucket to store Rekognition results
    const rekognitionResultsBucket = new s3.Bucket(this, 'RekognitionResultsBucket', {
      bucketName: "rekognition-results-bucket-086241b9-c21c-429e-af3d-3c98fff41ae6",
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    })

    // SNS topic called by Rekognition to indicate recognition process status
    const rekognitionCompletedTopic = new sns.Topic(this, 'RekognitionCompletedTopic', {
      displayName: 'Completed rekognition'
    });

    // To trigger Rekognition upon new object in videosBucket
    const initiateRekognitionFn = new lambdaNode.NodejsFunction(this, 'InitiateRekognition', {
      handler: 'initiateRekognition',
      entry: __dirname + '/lambdas/initiate-rekognition.ts',
      environment: {
        SnsTopicArn: rekognitionCompletedTopic.topicArn,
        SnsTopicRoleIAM: rekognitionRole.roleArn
      }
    });

    // hook for new video in bucket
    initiateRekognitionFn.addEventSource(new S3EventSource(videosBucket, {
      events: [ s3.EventType.OBJECT_CREATED_PUT ]
    }));

    initiateRekognitionFn.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

    // To store Rekognition results to S3
    const rekognitionResultNotificationFn = new lambdaNode.NodejsFunction(this, 'RekognitionResultNotification', {
      handler: 'persistRekognitionResults',
      entry: __dirname + '/lambdas/persist-rekognition.ts',
      environment: {
        RekognitionResultsBucketName: rekognitionResultsBucket.bucketName
      }
    });

    rekognitionResultNotificationFn.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

    // fire SNS once rekognition process is completed
    rekognitionCompletedTopic.addSubscription(new subscriptions.LambdaSubscription(rekognitionResultNotificationFn));
  }
}
