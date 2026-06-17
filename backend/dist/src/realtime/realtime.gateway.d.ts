import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly configService;
    server: Server;
    constructor(configService: ConfigService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
