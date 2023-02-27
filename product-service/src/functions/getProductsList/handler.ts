import { productList } from '../mock-data';


const getProductsList = async () => {
    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
        statusCode: 200,
        body: JSON.stringify(productList)
    }
}

export const main = getProductsList;