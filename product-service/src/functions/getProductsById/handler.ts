import { RESPONSE_HEADERS } from '../../models/response.model';
import { productList } from '../../models/mock-data';

export const getProductsById = async (event) => {
  const id = event.pathParameters?.productId;
  const product = productList.find(product => product.id === id);

  if (!product) {
    return {
      headers: RESPONSE_HEADERS,
      statusCode: 404,
      body: JSON.stringify('Product not found')
    }
  }
  return {
    headers: RESPONSE_HEADERS,
    statusCode: 200,
    body: JSON.stringify(product)
  }
}

export const main = getProductsById;