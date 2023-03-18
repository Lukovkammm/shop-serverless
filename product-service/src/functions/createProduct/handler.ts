import { DynamoDB } from 'aws-sdk';
import { randomUUID } from 'crypto';
import * as AWS from 'aws-sdk';

AWS.config.update({ region: 'eu-west-1' });
const dynamodb = new DynamoDB();

const putItem = async (tableName: string, item: { [key: string]: AWS.DynamoDB.AttributeValue }) => {
    const params: AWS.DynamoDB.PutItemInput = {
        TableName: tableName,
        Item: item
    };
    return dynamodb.putItem(params).promise();
};

export const createProduct = async (event) => {
    console.log('Incoming request:', event);

    const requestBody = JSON.parse(event.body);
    const { title, description, price, count } = requestBody;

    if (!title && !description && !price && !count) {
        throw new Error('Missing required fields');
    }

    const newProduct = {
        id: { S: randomUUID() },
        title: { S: title },
        description: { S: description },
        imageUrl: { S: "https://source.unsplash.com/random" },
        price: { N: price }
    };

    const newStockItem = {
        product_id: newProduct.id,
        count: { N: count }
    }

    try {
        await putItem('products', newProduct);
        await putItem('stocks', newStockItem);

        return {
            statusCode: 200,
            body: JSON.stringify('New product created'),
        };

    } catch (error) {
        console.error(error);

        const statusCode = error.message.includes('Missing required fields') ? 400 : 500;

        return {
          statusCode,
          body: JSON.stringify({ error: error.message })
        };
    }
}

export const main = createProduct;