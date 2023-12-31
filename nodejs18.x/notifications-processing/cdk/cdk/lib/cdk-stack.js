"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const kms = require("aws-cdk-lib/aws-kms");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
const s3 = require("aws-cdk-lib/aws-s3");
const sns = require("aws-cdk-lib/aws-sns");
class CdkStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new aws_cdk_lib_1.CfnParameter(this, 'AppId');
        // The code will be uploaded to this location during the pipeline's build step
        const artifactBucket = process.env.S3_BUCKET;
        const artifactKey = `${process.env.CODEBUILD_BUILD_ID}/function-code.zip`;
        // This is an SNS Topic with server-side encryption enabled, and default configuration properties
        // otherwise. To learn more about the available options, see
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html
        const topic = new sns.Topic(this, 'SimpleTopic', {
            masterKey: kms.Alias.fromAliasName(this, 'AwsSnsDefaultKey', 'alias/aws/sns'),
        });
        // This is a Lambda function config associated with the source code: sns-payload-logger.js
        new lambda.Function(this, 'snsPayloadLoggerFunction', {
            description: 'A Lambda function that logs the payload of messages sent to an associated SNS topic.',
            handler: 'src/handlers/sns-payload-logger.snsPayloadLoggerHandler',
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromBucket(s3.Bucket.fromBucketName(this, 'ArtifactBucket', artifactBucket), artifactKey),
            events: [new aws_lambda_event_sources_1.SnsEventSource(topic)],
        });
    }
}
exports.CdkStack = CdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFtRTtBQUNuRSwyQ0FBMkM7QUFDM0MsaURBQWlEO0FBQ2pELG1GQUFzRTtBQUN0RSx5Q0FBeUM7QUFDekMsMkNBQTJDO0FBRzNDLE1BQWEsUUFBUyxTQUFRLG1CQUFLO0lBQy9CLFlBQVksS0FBVSxFQUFFLEVBQVUsRUFBRSxLQUFpQjtRQUNqRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLDBCQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWhDLDhFQUE4RTtRQUM5RSxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVUsQ0FBQztRQUM5QyxNQUFNLFdBQVcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLG9CQUFvQixDQUFDO1FBRTFFLGlHQUFpRztRQUNqRyw0REFBNEQ7UUFDNUQsK0ZBQStGO1FBQy9GLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQzdDLFNBQVMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDO1NBQ2hGLENBQUMsQ0FBQztRQUVILDBGQUEwRjtRQUMxRixJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQ2xELFdBQVcsRUFBRSxzRkFBc0Y7WUFDbkcsT0FBTyxFQUFFLHlEQUF5RDtZQUNsRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FDeEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxFQUNoRSxXQUFXLENBQ2Q7WUFDRCxNQUFNLEVBQUUsQ0FBQyxJQUFJLHlDQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBN0JELDRCQTZCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgQ2ZuUGFyYW1ldGVyLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mta21zJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IFNuc0V2ZW50U291cmNlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ldmVudC1zb3VyY2VzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucyc7XG5cblxuZXhwb3J0IGNsYXNzIENka1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzOiBTdGFja1Byb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgICAgIG5ldyBDZm5QYXJhbWV0ZXIodGhpcywgJ0FwcElkJyk7XG5cbiAgICAgICAgLy8gVGhlIGNvZGUgd2lsbCBiZSB1cGxvYWRlZCB0byB0aGlzIGxvY2F0aW9uIGR1cmluZyB0aGUgcGlwZWxpbmUncyBidWlsZCBzdGVwXG4gICAgICAgIGNvbnN0IGFydGlmYWN0QnVja2V0ID0gcHJvY2Vzcy5lbnYuUzNfQlVDS0VUITtcbiAgICAgICAgY29uc3QgYXJ0aWZhY3RLZXkgPSBgJHtwcm9jZXNzLmVudi5DT0RFQlVJTERfQlVJTERfSUR9L2Z1bmN0aW9uLWNvZGUuemlwYDtcblxuICAgICAgICAvLyBUaGlzIGlzIGFuIFNOUyBUb3BpYyB3aXRoIHNlcnZlci1zaWRlIGVuY3J5cHRpb24gZW5hYmxlZCwgYW5kIGRlZmF1bHQgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzXG4gICAgICAgIC8vIG90aGVyd2lzZS4gVG8gbGVhcm4gbW9yZSBhYm91dCB0aGUgYXZhaWxhYmxlIG9wdGlvbnMsIHNlZVxuICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zbnMtdG9waWMuaHRtbFxuICAgICAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWModGhpcywgJ1NpbXBsZVRvcGljJywge1xuICAgICAgICAgICAgbWFzdGVyS2V5OiBrbXMuQWxpYXMuZnJvbUFsaWFzTmFtZSh0aGlzLCAnQXdzU25zRGVmYXVsdEtleScsICdhbGlhcy9hd3Mvc25zJyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRoaXMgaXMgYSBMYW1iZGEgZnVuY3Rpb24gY29uZmlnIGFzc29jaWF0ZWQgd2l0aCB0aGUgc291cmNlIGNvZGU6IHNucy1wYXlsb2FkLWxvZ2dlci5qc1xuICAgICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdzbnNQYXlsb2FkTG9nZ2VyRnVuY3Rpb24nLCB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgTGFtYmRhIGZ1bmN0aW9uIHRoYXQgbG9ncyB0aGUgcGF5bG9hZCBvZiBtZXNzYWdlcyBzZW50IHRvIGFuIGFzc29jaWF0ZWQgU05TIHRvcGljLicsXG4gICAgICAgICAgICBoYW5kbGVyOiAnc3JjL2hhbmRsZXJzL3Nucy1wYXlsb2FkLWxvZ2dlci5zbnNQYXlsb2FkTG9nZ2VySGFuZGxlcicsXG4gICAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21CdWNrZXQoXG4gICAgICAgICAgICAgICAgczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHRoaXMsICdBcnRpZmFjdEJ1Y2tldCcsIGFydGlmYWN0QnVja2V0KSxcbiAgICAgICAgICAgICAgICBhcnRpZmFjdEtleSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBldmVudHM6IFtuZXcgU25zRXZlbnRTb3VyY2UodG9waWMpXSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19