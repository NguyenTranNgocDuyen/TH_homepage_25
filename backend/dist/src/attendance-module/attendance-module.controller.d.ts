import { AttendanceModuleService } from './attendance-module.service';
import ResponseDto, { AnotherError, DefaultResponse } from "../common/response.dto";
import type { Request } from 'express';
import GetAttendenceDto from './dto/getAttendence.dto';
import CheckInDto from './dto/checkIn.dto';
import CheckOutDto from './dto/checkOut.dto';
export declare class AttendanceModuleController {
    private readonly attendanceModuleService;
    constructor(attendanceModuleService: AttendanceModuleService);
    checkIn(userID: string, checkInDto: CheckInDto, req: Request): Promise<ResponseDto<AnotherError>>;
    checkOut(userID: string, checkOutDto: CheckOutDto, req: Request): Promise<ResponseDto<AnotherError>>;
    getAllEntryOfMonth(userID: string, getAttendence: GetAttendenceDto): Promise<DefaultResponse>;
    GetAllEmployeeDindNotCheckOutOfDay(): Promise<DefaultResponse>;
}
