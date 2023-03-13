import { productList } from "../../models/mock-data";
import { getProductsList } from "../getProductsList/handler";

describe('getProductsById', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('returns product with specified ID when it exists', async () => {
        const response = await getProductsList();

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify(productList));
    });
});