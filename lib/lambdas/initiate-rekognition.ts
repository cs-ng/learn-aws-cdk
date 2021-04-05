import { RekognitionClient, StartFaceDetectionCommand } from "@aws-sdk/client-rekognition";

export async function initiateRekognition(event: any, context: any) {
    const rekognitionClient = new RekognitionClient({});
    const rekognitionCommand = new StartFaceDetectionCommand({
        Video: {
            S3Object: {
                Bucket: event.Records[0].s3.bucket.name,
                Name: decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))
            }
        },
        NotificationChannel: {
            SNSTopicArn: process.env.SnsTopicArn,
            RoleArn: process.env.SnsTopicRoleIAM
        }
    });
    const rekognitionResponse = await rekognitionClient.send(rekognitionCommand);

    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(rekognitionResponse)
      };
}
