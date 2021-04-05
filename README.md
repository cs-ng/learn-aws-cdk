# Learn CDK

## Flows
1. Upload video to videos-bucket
2. lambda will be triggered to initiate Rekognition process on the uploaded video
3. SNS will be triggered by Rekognition once the recognition process is done
4. lambda will be triggered by the SNS to store the Rekognition results in s3 bucket

## How to run
1. `npm install`
2. `cdk deploy` 
3. to run test: `npm test`
4. to check diff: `cdk diff`

## Thoughts
1. Dev experience is pleasant. It makes IaC so much simpler. 
2. Workflow & experience are quite similar to Terraform. There is a CDK Terraform, provided if Terraform is preferred, or the state management is an important requirement, otherwise CDK itself is sufficient.
3. Commonly used programming languages are supported. There is no need to learn new language, compared to native Terraform. Also it makes the repo (which contains of the logic + infra) less awkward, as they can share the same language.
4. Easier to test. I know unit testing is also possible on terraform, but it is quite hideous, testing with jest is much more simpler.