import { S3 } from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser = async (event) => {
    const s3 = new S3({ region: 'eu-west-1' });
    const s3Event = event.Records[0].s3;
    const bucket = s3Event.bucket.name;
    const key = s3Event.object.key;
    console.log(`Bucket: ${bucket}, key: ${key}`);

    const s3ReadStream = await s3.getObject({
        Bucket: bucket,
        Key: key
    }).createReadStream();

    s3ReadStream.pipe(csv({ separator: ',' }))
        .on('data', (data) => {
            console.log('!!! Data', JSON.stringify(data));
        })
        .on('end', () => {
            console.log(`CSV file successfully processed: bucket - ${bucket}, key - ${key}`);
        });

    try {
        const copyParams = {
            Bucket: bucket,
            CopySource: `${bucket}/${key}`,
            Key: `${key.replace('uploaded', 'parsed')}`
            
        };
        await s3.copyObject(copyParams).promise();

        const deleteParams = {
            Bucket: bucket,
            Key: key
        };
        await s3.deleteObject(deleteParams).promise();
        console.log(`Successfully moved and deleted file: s3://${bucket}/${key}`);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const main = importFileParser;