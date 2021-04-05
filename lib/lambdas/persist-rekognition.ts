import { RekognitionClient, GetFaceDetectionCommand } from "@aws-sdk/client-rekognition";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export async function persistRekognitionResults(event: any, context: any) {
    const rekognitionClient = new RekognitionClient({});
    const s3Client = new S3Client({});

    const snsMessage = JSON.parse(event.Records[0].Sns.Message);
    const rekognitionJobId = snsMessage.JobId;
    const rekognitionCommand = new GetFaceDetectionCommand({ JobId: rekognitionJobId });
    const rekognitionResult = await rekognitionClient.send(rekognitionCommand);

    const s3Command = new PutObjectCommand({ 
      Bucket: process.env.RekognitionResultsBucketName, 
      Key: `${uuidv4()}.json`, 
      Body: JSON.stringify(rekognitionResult), 
      ContentType: "application/json" 
    });
    const response = await s3Client.send(s3Command);

    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(response)
      };
}
