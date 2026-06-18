import { PrismaService } from "../prisma/prisma.service";
import { AttendanceModuleService } from './attendance-module.service';
import { EmailService } from "../common/email.service";
import { WarningService } from "../warning/warning.service";
import ResponseDto, { DefaultResponse } from "../common/response.dto";
export declare class MissedCheckoutTask {
    private readonly prismaService;
    private readonly attendanceService;
    private readonly warningService;
    private readonly emailService;
    constructor(prismaService: PrismaService, attendanceService: AttendanceModuleService, warningService: WarningService, emailService: EmailService);
    processMissingCheckouts(): Promise<ResponseDto<DefaultResponse>>;
    private formatDateKey;
}
