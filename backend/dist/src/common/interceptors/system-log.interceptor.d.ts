import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeService } from '../../realtime/realtime.service';
export declare class SystemLogInterceptor implements NestInterceptor {
    private readonly prisma;
    private readonly realtimeService?;
    constructor(prisma: PrismaService, realtimeService?: RealtimeService | undefined);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
