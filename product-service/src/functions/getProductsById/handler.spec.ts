import { getProductsById } from "../getProductsById/handler";

describe('getProductsById', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('returns product with specified ID when it exists', async () => {
        const product = {
            "title": "Favorite Chicken Potpie",
            "description": "Pie in pots with chicken, potatoes, peas and corn",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
            "imageUrl": "https://www.tasteofhome.com/wp-content/uploads/2018/01/exps21444_TH132767B05_02_1b_WEB-9.jpg?resize=768,768",
            "count": 4,
            "price": 12.4
        };
        const event = { pathParameters: { productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' } };
        const response = await getProductsById(event);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify(product));
    });

    test('returns error when product with specified ID does not exist', async () => {
        const event = { pathParameters: { productId: '123' } };
        const response = await getProductsById(event);
      
        expect(response.statusCode).toBe(404);
        expect(response.body).toBe(JSON.stringify('Product not found'));
      });
});