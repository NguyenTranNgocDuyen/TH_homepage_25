import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    pingDatabase(): Promise<{
        status: string;
        message: string;
    }>;
}
