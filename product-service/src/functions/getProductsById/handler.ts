import { DynamoDB } from 'aws-sdk';
import { RESPONSE_HEADERS } from '../../models/response.model';

const dynamodb = new DynamoDB.DocumentClient();

export const getProductsById = async (event) => {
  console.log('Incoming request:', event);

  try {
    const id = event.pathParameters.productId;

    const resultProduct = await dynamodb.get({ TableName: 'products', Key: { id } }).promise();
    const productItem = resultProduct.Item;

    const resultStocks = await dynamodb.get({ TableName: 'stocks', Key: { product_id: id } }).promise();
    const stockItem = resultStocks.Item;

    if (!productItem && !stockItem) {
      throw new Error(`Product with id ${id} not found`);
    }

    const product = await productItem;
    const stock = await stockItem;
    const productWithStock = { ...product, count: stock.count };

    return {
      headers: RESPONSE_HEADERS,
      statusCode: 200,
      body: JSON.stringify(productWithStock)
    }

  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to retrieve product' })
    };
  }
}

export const main = getProductsById;