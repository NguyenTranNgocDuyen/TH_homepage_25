export default class ResponseDto<T> {
    statusCode: number;
    message: string;
    data?: T;
    constructor(partial: Partial<ResponseDto<T>>);
}
declare class AnotherError {
    statusCode: number;
    message: string;
    data?: any;
}
declare class DefaultResponse {
    statusCode: number;
    message: string;
    data?: unknown;
}
export { AnotherError, DefaultResponse };
