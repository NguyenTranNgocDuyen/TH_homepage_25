import { RealtimeGateway } from './realtime.gateway';
export declare class RealtimeService {
    private readonly realtimeGateway;
    constructor(realtimeGateway: RealtimeGateway);
    emitToUser(userID: string, event: string, payload: unknown): void;
    emitToAdmin(event: string, payload: unknown): void;
}
