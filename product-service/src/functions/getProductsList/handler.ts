import { RESPONSE_HEADERS } from '../../models/response.model';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const getProductsList = async () => {
    try {
        const result = await dynamodb.scan({ TableName: 'products' }).promise();
        const products = result.Items;

        const stockPromises = products.map(async (product) => {
            const stockResult = await dynamodb.get({
                TableName: 'stocks',
                Key: { product_id: product.id },
            })
                .promise();

            const stock = stockResult.Item;
            return { ...product, stock };
        })

        const productsWithStock = await Promise.all(stockPromises);

        if (!productsWithStock.length) {
            return {
                headers: RESPONSE_HEADERS,
                statusCode: 404,
                body: JSON.stringify('Products not found'),
            };
        }

        return {
            headers: RESPONSE_HEADERS,
            statusCode: 200,
            body: JSON.stringify(productsWithStock),
        };

    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
}

export const main = getProductsList;