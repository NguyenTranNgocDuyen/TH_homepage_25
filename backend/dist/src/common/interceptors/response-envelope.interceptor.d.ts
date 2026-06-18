import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
interface ResponseEnvelope<T> {
    statusCode: number;
    message: string;
    data?: T;
}
export declare class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, ResponseEnvelope<T> | T> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseEnvelope<T> | T>;
    private isEnvelope;
}
export {};
