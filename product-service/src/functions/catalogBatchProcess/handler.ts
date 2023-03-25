import { SQSEvent } from 'aws-lambda';
import { Lambda } from 'aws-sdk';

const lambda = new Lambda({ region: 'eu-west-1' });

export const catalogBatchProcess = async (event: SQSEvent) => {
    try {
        const productsPromises = event.Records.map(({ body }) => {
            const parsedData = JSON.parse(body);

            const newProduct = {
                title: parsedData.title,
                description: parsedData.description,
                imageUrl: parsedData.imageUrl || 'https://source.unsplash.com/random',
                price: parsedData.price,
                count: parsedData.count,
            };

            const params = {
                FunctionName: 'product-service-dev-createProduct',
                InvocationType: 'Event',
                Payload: JSON.stringify({ body: newProduct }),
            };
            return lambda.invoke(params).promise();
        });

        await Promise.all(productsPromises);

        return {
            statusCode: 200,
            body: 'Products created',
        };
    } catch (err) {
        console.log('Error: ', err);
        return {
            statusCode: 500,
            body: 'Error happened while creating the products',
        };
    }
};

export const main = catalogBatchProcess;