// Interfaces
export interface ResponseHeader {
    [header: string]: string | number | boolean;
}

export interface IResponseBody {
    data: any;
    message: string;
    status?: string;
}

export interface IResponse {
    statusCode: number;
    headers: ResponseHeader;
    body: string;
}

// Enums

export enum Status {
    SUCCESS = 'Success',
    ERROR = 'Error',
    BAD_REQUEST = 'Bad request',
}

export const STATUS_MESSAGES = {
    200: Status.SUCCESS,
    400: Status.BAD_REQUEST,
    500: Status.ERROR,
}

export const RESPONSE_HEADERS: ResponseHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Credentials': true, 
};