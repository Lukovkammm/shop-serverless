import { DynamoDB } from 'aws-sdk';
import { RESPONSE_HEADERS } from '../../models/response.model';

const dynamodb = new DynamoDB.DocumentClient();

export const getProductsById = async (event) => {
  try {
    const id = event.pathParameters.productId.toString();

    const resultProduct = await dynamodb.get({ TableName: 'products', Key: { id: id } }).promise();
    const product = resultProduct.Item;
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    const resultStocks = await dynamodb.get({ TableName: 'stocks', Key: { product_id: id } }).promise();
    const stockItem = resultStocks.Item;

    const productWithStock = await Promise.all([product, stockItem]);
    if (!productWithStock) {
      return {
        headers: RESPONSE_HEADERS,
        statusCode: 404,
        body: JSON.stringify('Product not found')
      }
    }

    return {
      headers: RESPONSE_HEADERS,
      statusCode: 200,
      body: JSON.stringify(productWithStock)
    }

  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}

export const main = getProductsById;