import type { Request, Response } from 'express';
import { MonthlyTimeSheetService } from './monthly-time-sheet.service';
import { DefaultResponse } from "../common/response.dto";
import GetTimeSheetDto from './dto/get-timesheet.dto';
import ReportTimesheetDto from './dto/report-timesheet.dto';
import CreateMonthlyTimeSheetDto from './dto/create-timesheet.dto';
import ReviewMonthlyTimesheetDto from './dto/review-monthly-timesheet.dto';
import { RequestUser } from "../common/types";
interface AuthenticatedRequest extends Request {
    user?: RequestUser;
}
export declare class MonthlyTimeSheetController {
    private readonly timeSheetService;
    constructor(timeSheetService: MonthlyTimeSheetService);
    getMonthlyTimesheet(userID: string, getTimesheetDto: GetTimeSheetDto): Promise<DefaultResponse>;
    getMonthlyTimesheetsForReview(getTimesheetDto: GetTimeSheetDto, req: AuthenticatedRequest): Promise<DefaultResponse>;
    getTimesheetReport(reportQuery: ReportTimesheetDto, req: AuthenticatedRequest): Promise<DefaultResponse>;
    exportPersonalTimesheetCSV(userID: string, month: string, year: string, format: string | undefined, res: Response): Promise<void>;
    exportPersonalTimesheetExcel(userID: string, month: string, year: string, res: Response): Promise<void>;
    exportDepartmentTimesheetCSV(departmentID: string, month: string, year: string, res: Response): Promise<void>;
    exportDepartmentTimesheetExcel(departmentID: string, month: string, year: string, res: Response): Promise<void>;
    createMonthlyTimesheet(userID: string, createMonthlyTimessheet: CreateMonthlyTimeSheetDto): Promise<DefaultResponse>;
    SubmitMonthlyTimesheet(monthlyTImesheetID: string): Promise<{
        statusCode: number;
        message: string;
        data: unknown;
    }>;
    reviewMonthlyTimsheet(monthlyTimesheetID: string, reviewMonthlyTimesheetDto: ReviewMonthlyTimesheetDto, req: AuthenticatedRequest): Promise<{
        statusCode: number;
        message: string;
        data: import("./dto/monthly-tinesheet-respone.dto").MonthlyTimesheeetResponeDto | undefined;
    }>;
}
export {};
