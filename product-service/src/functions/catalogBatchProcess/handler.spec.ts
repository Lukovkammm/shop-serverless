import { SQSEvent } from 'aws-lambda';
import { Lambda } from 'aws-sdk';
import { catalogBatchProcess } from './handler';

const event = {
    Records: [
        {
            body: JSON.stringify({
                title: 'Test Product 1',
                description: 'Test Product 1 description',
                price: 12.34,
                count: 10,
            }),
        },
        {
            body: JSON.stringify({
                title: 'Test Product 2',
                description: 'Test Product 2 description',
                price: 56.78,
                count: 20,
            }),
        },
    ],
} as SQSEvent;

jest.mock('aws-sdk', () => {
    const mLambda = {
        invoke: jest.fn(),
    };
    return {
        Lambda: jest.fn(() => mLambda),
    };
});

describe('catalogBatchProcess', () => {
    const mockedLambda = new Lambda() as jest.Mocked<Lambda>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns a success message when all products are created', async () => {


        // Simulate successful invocation of createProduct lambda
        mockedLambda.invoke.mockReturnValueOnce({
            promise: () => Promise.resolve(),
        });

        const response = await catalogBatchProcess(event);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe('Products created');
    });

    it('returns an error message when there is an error during product creation', async () => {
        mockedLambda.invoke.mockReturnValueOnce({
            promise: () => Promise.reject(new Error('Error creating product')),
        });

        const response = await catalogBatchProcess(event);

        expect(response.statusCode).toBe(500);
        expect(response.body).toBe('Error happened while creating the products');
    });
});
