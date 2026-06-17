import { WarningLevel } from '@prisma/client';
export declare class CreateWarningDto {
    userID: string;
    content: string;
    level?: WarningLevel;
}
