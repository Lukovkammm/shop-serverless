import { S3 } from 'aws-sdk';

export const importProductsFile = async (event) => {
  const s3 = new S3({ region: 'eu-west-1' });
  const BUCKET = 'module-5-uploaded';
  const fileName = event.queryStringParameters.name;

  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: 'text/csv'
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    console.log('Signed URL:', url);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(url)
    };
  } catch (error) {
    console.log('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Failed to get signed URL' })
    };
  }
};

export const main = importProductsFile;