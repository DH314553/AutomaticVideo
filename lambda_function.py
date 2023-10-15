import json
import boto3

def lambda_handler(event, context):
    render_id = event.get('render_id', None)
    if render_id:
        # 例えば、S3に保存されたファイルを移動する。
        s3 = boto3.resource('s3')
        try:
            s3.Object('destination-bucket', f'{render_id}.mp4').copy_from(CopySource=f'source-bucket/{render_id}.mp4')
        except Exception as e:
            return {
                'statusCode': 500,
                'body': json.dumps(f'Failed to move file for {render_id}, reason: {e}')
            }

        return {
            'statusCode': 200,
            'body': json.dumps(f'Rendering completed for {render_id}')
        }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps('No render_id provided')
        }
