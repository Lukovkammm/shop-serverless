import { RESPONSE_HEADERS } from '../../models/response.model';
import { productList } from '../../models/mock-data';

export const getProductsList = async () => {
    return {
        headers: RESPONSE_HEADERS,
        statusCode: 200,
        body: JSON.stringify(productList)
    }
}

export const main = getProductsList;