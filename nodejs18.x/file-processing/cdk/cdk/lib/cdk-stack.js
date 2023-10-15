"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
const s3 = require("aws-cdk-lib/aws-s3");
class CdkStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const appId = new aws_cdk_lib_1.CfnParameter(this, 'AppId');
        // The code will be uploaded to this location during the pipeline's build step
        const artifactBucket = process.env.S3_BUCKET;
        const artifactKey = `${process.env.CODEBUILD_BUILD_ID}/function-code.zip`;
        // Create an S3 bucket, with the given name
        const bucketId = 'simpleappbucket';
        const bucket = new s3.Bucket(this, bucketId, {
            bucketName: ['aws', this.region, this.account, appId.value.toString(), bucketId].join('-'),
            encryption: s3.BucketEncryption.S3_MANAGED,
        });
        // This is a Lambda function config associated with the source code: s3-json-logger.js
        const s3JsonLoggerFunction = new lambda.Function(this, 's3JsonLogger', {
            description: 'A Lambda function that logs a json file sent to S3 bucket.',
            handler: 'src/handlers/s3-json-logger.s3JsonLoggerHandler',
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromBucket(s3.Bucket.fromBucketName(this, 'ArtifactBucket', artifactBucket), artifactKey),
            events: [
                new aws_lambda_event_sources_1.S3EventSource(bucket, { events: [s3.EventType.OBJECT_CREATED], filters: [{ suffix: '.json' }] }),
            ],
        });
        // Give Read permissions to the S3 bucket
        bucket.grantRead(s3JsonLoggerFunction);
    }
}
exports.CdkStack = CdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFtRTtBQUNuRSxpREFBaUQ7QUFDakQsbUZBQXFFO0FBQ3JFLHlDQUF5QztBQUd6QyxNQUFhLFFBQVMsU0FBUSxtQkFBSztJQUMvQixZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBaUI7UUFDakQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSwwQkFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU5Qyw4RUFBOEU7UUFDOUUsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFVLENBQUM7UUFDOUMsTUFBTSxXQUFXLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixvQkFBb0IsQ0FBQztRQUUxRSwyQ0FBMkM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUM7UUFDbkMsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDekMsVUFBVSxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDMUYsVUFBVSxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVO1NBQzdDLENBQUMsQ0FBQztRQUVILHNGQUFzRjtRQUN0RixNQUFNLG9CQUFvQixHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ25FLFdBQVcsRUFBRSw0REFBNEQ7WUFDekUsT0FBTyxFQUFFLGlEQUFpRDtZQUMxRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FDeEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxFQUNoRSxXQUFXLENBQ2Q7WUFDRCxNQUFNLEVBQUU7Z0JBQ0osSUFBSSx3Q0FBYSxDQUNiLE1BQU0sRUFDTixFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUM1RTthQUNKO1NBQ0osQ0FBQyxDQUFDO1FBQ0gseUNBQXlDO1FBQ3pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUMzQyxDQUFDO0NBQ0o7QUFwQ0QsNEJBb0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBDZm5QYXJhbWV0ZXIsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgUzNFdmVudFNvdXJjZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtZXZlbnQtc291cmNlcyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuXG5cbmV4cG9ydCBjbGFzcyBDZGtTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wczogU3RhY2tQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICBjb25zdCBhcHBJZCA9IG5ldyBDZm5QYXJhbWV0ZXIodGhpcywgJ0FwcElkJyk7XG5cbiAgICAgICAgLy8gVGhlIGNvZGUgd2lsbCBiZSB1cGxvYWRlZCB0byB0aGlzIGxvY2F0aW9uIGR1cmluZyB0aGUgcGlwZWxpbmUncyBidWlsZCBzdGVwXG4gICAgICAgIGNvbnN0IGFydGlmYWN0QnVja2V0ID0gcHJvY2Vzcy5lbnYuUzNfQlVDS0VUITtcbiAgICAgICAgY29uc3QgYXJ0aWZhY3RLZXkgPSBgJHtwcm9jZXNzLmVudi5DT0RFQlVJTERfQlVJTERfSUR9L2Z1bmN0aW9uLWNvZGUuemlwYDtcblxuICAgICAgICAvLyBDcmVhdGUgYW4gUzMgYnVja2V0LCB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICAgICAgIGNvbnN0IGJ1Y2tldElkID0gJ3NpbXBsZWFwcGJ1Y2tldCc7XG4gICAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgYnVja2V0SWQsIHtcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IFsnYXdzJywgdGhpcy5yZWdpb24sIHRoaXMuYWNjb3VudCwgYXBwSWQudmFsdWUudG9TdHJpbmcoKSwgYnVja2V0SWRdLmpvaW4oJy0nKSxcbiAgICAgICAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uUzNfTUFOQUdFRCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVGhpcyBpcyBhIExhbWJkYSBmdW5jdGlvbiBjb25maWcgYXNzb2NpYXRlZCB3aXRoIHRoZSBzb3VyY2UgY29kZTogczMtanNvbi1sb2dnZXIuanNcbiAgICAgICAgY29uc3QgczNKc29uTG9nZ2VyRnVuY3Rpb24gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdzM0pzb25Mb2dnZXInLCB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgTGFtYmRhIGZ1bmN0aW9uIHRoYXQgbG9ncyBhIGpzb24gZmlsZSBzZW50IHRvIFMzIGJ1Y2tldC4nLFxuICAgICAgICAgICAgaGFuZGxlcjogJ3NyYy9oYW5kbGVycy9zMy1qc29uLWxvZ2dlci5zM0pzb25Mb2dnZXJIYW5kbGVyJyxcbiAgICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YLFxuICAgICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUJ1Y2tldChcbiAgICAgICAgICAgICAgICBzMy5CdWNrZXQuZnJvbUJ1Y2tldE5hbWUodGhpcywgJ0FydGlmYWN0QnVja2V0JywgYXJ0aWZhY3RCdWNrZXQpLFxuICAgICAgICAgICAgICAgIGFydGlmYWN0S2V5LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGV2ZW50czogW1xuICAgICAgICAgICAgICAgIG5ldyBTM0V2ZW50U291cmNlKFxuICAgICAgICAgICAgICAgICAgICBidWNrZXQsXG4gICAgICAgICAgICAgICAgICAgIHsgZXZlbnRzOiBbczMuRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVEXSwgZmlsdGVyczogW3sgc3VmZml4OiAnLmpzb24nIH1dIH1cbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEdpdmUgUmVhZCBwZXJtaXNzaW9ucyB0byB0aGUgUzMgYnVja2V0XG4gICAgICAgIGJ1Y2tldC5ncmFudFJlYWQoczNKc29uTG9nZ2VyRnVuY3Rpb24pO1xuICAgIH1cbn1cbiJdfQ==