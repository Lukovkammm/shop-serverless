import { S3 } from "aws-sdk";
import { importProductsFile } from "./handler";

jest.mock('aws-sdk');

describe('importProductsFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a signed URL', async () => {
    const mockGetSignedUrlPromise = jest.fn().mockReturnValue('https://signedurl.com');
    S3.prototype.getSignedUrlPromise = mockGetSignedUrlPromise;

    const event = {
      queryStringParameters: {
        name: 'test.csv'
      }
    };

    const expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify('https://signedurl.com')
    };

    const result = await importProductsFile(event);

    expect(result).toEqual(expectedResponse);
    expect(mockGetSignedUrlPromise).toHaveBeenCalledWith('putObject', {
      Bucket: 'module-5-uploaded',
      Key: 'uploaded/test.csv',
      Expires: 60,
      ContentType: 'text/csv'
    });
  });

  it('should return an error message if getSignedUrlPromise fails', async () => {
    const mockGetSignedUrlPromise = jest.fn().mockRejectedValue(new Error('Failed to get signed URL'));
    S3.prototype.getSignedUrlPromise = mockGetSignedUrlPromise;

    const event = {
      queryStringParameters: {
        name: 'test.csv'
      }
    };

    const expectedResponse = {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Failed to get signed URL' })
    };

    const result = await importProductsFile(event);

    expect(result).toEqual(expectedResponse);
    expect(mockGetSignedUrlPromise).toHaveBeenCalledWith('putObject', {
      Bucket: 'module-5-uploaded',
      Key: 'uploaded/test.csv',
      Expires: 60,
      ContentType: 'text/csv'
    });
  });
});
