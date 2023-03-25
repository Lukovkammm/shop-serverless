import { S3, SQS } from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser = async (event) => {
    const s3 = new S3({ region: 'eu-west-1' });
    const s3Event = event.Records[0].s3;
    const bucket = s3Event.bucket.name;
    const key = s3Event.object.key;
    console.log(`Bucket: ${bucket}, key: ${key}`);

    const sqs = new SQS();

    const s3ReadStream = await s3.getObject({
        Bucket: bucket,
        Key: key
    }).createReadStream();

    s3ReadStream.pipe(csv({ separator: ',' }))
        .on('data', (data) => {
            sqs.sendMessage({
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(data)
            }, (err, data) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log(`CSV record successfully sent to SQS: ${JSON.stringify(data)}`);
            });
        })
        .on('end', () => {
            console.log(`CSV file successfully processed: bucket - ${bucket}, key - ${key}`);

            try {
                const copyParams = {
                    Bucket: bucket,
                    CopySource: `${bucket}/${key}`,
                    Key: `${key.replace('uploaded', 'parsed')}`

                };
                s3.copyObject(copyParams, (err, data) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    console.log(`Successfully copied file to ${copyParams.Key}: ${JSON.stringify(data)}`);
                });

                const deleteParams = {
                    Bucket: bucket,
                    Key: key
                };
                s3.deleteObject(deleteParams, (err, data) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    console.log(`Successfully deleted file: s3://${bucket}/${key}. Data: ${data}`);
                });
            } catch (err) {
                console.log(err);
                throw err;
            }
        });
};

export const main = importFileParser;