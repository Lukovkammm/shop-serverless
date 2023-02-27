import { productList } from '../mock-data';

const getProductsById = async (event) => {
  const id = event.pathParameters.productId;
  const product = productList.find(product => product.id === id);

  if (!product) {
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      statusCode: 404,
      body: 'Product not found'
    }
  }
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    statusCode: 200,
    body: JSON.stringify(product)
  }
}

export const main = getProductsById;