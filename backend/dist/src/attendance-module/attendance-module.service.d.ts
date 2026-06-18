import { PrismaService } from "../prisma/prisma.service";
import { DefaultResponse } from "../common/response.dto";
import { UserService } from "../user/user.service";
import { MonthlyTimeSheetService } from "../monthly-time-sheet/monthly-time-sheet.service";
import GetAttendenceDto from './dto/getAttendence.dto';
import { Prisma } from '@prisma/client';
import { NotificationService } from "../notification/notification.service";
export declare class AttendanceModuleService {
    private readonly prismaService;
    private readonly userService;
    private readonly monthlyTimesheetService;
    private readonly notificationService;
    constructor(prismaService: PrismaService, userService: UserService, monthlyTimesheetService: MonthlyTimeSheetService, notificationService: NotificationService);
    private reopenCurrentTimesheetForAttendance;
    getAllAttedencOfMonth(userID: string, getAttedencOfMonth: GetAttendenceDto, tx?: Prisma.TransactionClient): Promise<DefaultResponse>;
    checkIn(userID: string, IPAddress: string | undefined, deviceInfo?: string, tx?: Prisma.TransactionClient): Promise<DefaultResponse>;
    checkOut(userID: string, IPAddress: string | undefined, deviceInfo?: string, tx?: Prisma.TransactionClient): Promise<DefaultResponse>;
    GetAllEmployeeDidNotCheckOutBefore(date: string, tx?: Prisma.TransactionClient): Promise<DefaultResponse>;
}
