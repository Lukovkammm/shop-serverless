import * as AWS from 'aws-sdk';
import { productList } from 'src/models/mock-data';

AWS.config.update({ region: 'eu-west-1' });
const dynamodb = new AWS.DynamoDB();

const putItem = async (tableName: string, item: { [key: string]: AWS.DynamoDB.AttributeValue }) => {
    const params: AWS.DynamoDB.PutItemInput = {
        TableName: tableName,
        Item: item
    };
    return dynamodb.putItem(params).promise();
};

(async () => {
    try {
        // populate 'products' table
        for (const product of productList) {
            const item = {
                'id': { S: product.id },
                'title': { S: product.title },
                'imageUrl': { S: product.imageUrl },
                'description': { S: product.description },
                'price': { N: product.price.toString() },
            };
            console.log(`Adding product ${product.id} to products table`);
            await putItem('products', item);
        }

        // populate 'stocks' table
        for (const product of productList) {
            const item = {
                'product_id': { S: product.id },
                'count': { N: product.count.toString() },
            };
            await putItem('stocks', item);
        }

        console.log('Tables populated successfully');
    } catch (error) {
        console.log('Error populating tables', error);
    }
})();

