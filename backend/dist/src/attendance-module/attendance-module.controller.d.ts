import { AttendanceModuleService } from './attendance-module.service';
import { DefaultResponse } from "../common/response.dto";
import type { Request } from 'express';
import GetAttendenceDto from './dto/getAttendence.dto';
import CheckInDto from './dto/checkIn.dto';
import CheckOutDto from './dto/checkOut.dto';
export declare class AttendanceModuleController {
    private readonly attendanceModuleService;
    constructor(attendanceModuleService: AttendanceModuleService);
    checkIn(userID: string, checkInDto: CheckInDto, req: Request): Promise<DefaultResponse>;
    checkOut(userID: string, checkOutDto: CheckOutDto, req: Request): Promise<DefaultResponse>;
    getAllEntryOfMonth(userID: string, getAttendence: GetAttendenceDto): Promise<DefaultResponse>;
    GetAllEmployeeDindNotCheckOutOfDay(): Promise<DefaultResponse>;
}
