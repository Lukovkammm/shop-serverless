import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
import csv from 'csv-parser';

const importFileParser = async (event) => {
    console.log('!!! Event: ', event);

    const s3 = new S3({ region: 'eu-west-1' });
    const BUCKET = 'module-5-uploaded';


    for (const record of event.Records) {
        const s3stream = await s3.getObject({
            Bucket: BUCKET,
            Key: record.s3.object.key
        }).createReadStream();

        console.log('!!! s3stream: ', s3stream);

        s3stream.pipe(csv({ separator: ',' }))
            .on('data', (data) => {
                console.log(data);
            })
            .on('end', () => {
                console.log('CSV file successfully processed.');
            });

       
        console.log('!!! Record: ', record);
    }

    return {
        statusCode: 200
    }

};

export const main = middyfy(importFileParser);

