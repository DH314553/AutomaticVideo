from remotion_lambda import RenderParams, RemotionClient
import os
from dotenv import load_dotenv
import requests
import boto3

load_dotenv()

# Load environment variables and check if they are set
def get_env_var(name):
    value = os.getenv(name)
    if not value:
        raise Exception(f"{name} is not set")
    return value

REMOTION_APP_REGION = get_env_var('us-east-1')
REMOTION_APP_FUNCTION_NAME = get_env_var('aws_lambda_remotion')
REMOTION_APP_SERVE_URL = get_env_var('http://127.0.0.1:5000')

# Initialize Remotion and S3 clients
client = RemotionClient(
    region=REMOTION_APP_REGION, serve_url=REMOTION_APP_SERVE_URL, function_name=REMOTION_APP_FUNCTION_NAME)
s3 = boto3.client('s3')

# Set up and execute the render request
render_params = RenderParams(composition="react-svg", data={'hi': 'there'})
render_response = client.render_media_on_lambda(render_params)

if render_response:
    print("Render ID:", render_response.renderId)
    print("Bucket name:", render_response.bucketName)

    # Monitor rendering progress
    progress_response = client.get_render_progress(
        render_id=render_response.renderId, bucket_name=render_response.bucketName)

    while progress_response and not progress_response.done:
        print("Overall progress:", progress_response.overallProgress * 100, "%")
        progress_response = client.get_render_progress(
            render_id=render_response.renderId, bucket_name=render_response.bucketName)

    print("Render done! Output file:", progress_response.outputFile)

    # Notify an API endpoint about the completion
    api_url = "https://l699txm0q4.execute-api.us-east-1.amazonaws.com/default/remotion-render-3-3-103-mem2048mb-disk2048mb-120sec"
    response = requests.post(api_url, json={"render_id": render_response.renderId})
    
    if response.status_code == 200:
        print("API request successful:", response.json())
    else:
        print("API request failed:", response.status_code)
        print("Reason:", response.text)

    # Upload the output file to an S3 bucket
    s3.upload_file(progress_response.outputFile, 'your-bucket', f'{render_response.renderId}.mp4')
