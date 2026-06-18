import { ConfigService } from '@nestjs/config';
export declare class BycyptHashedService {
    private configService;
    private readonly saltRounds;
    constructor(configService: ConfigService);
    hash(password: string): Promise<string>;
    compare(password: string, hashed: string): Promise<boolean>;
}
