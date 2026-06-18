import { PrismaService } from "../prisma/prisma.service";
import CreateMonthlyTimeSheetDto from './dto/create-timesheet.dto';
import ResponseDto, { DefaultResponse } from "../common/response.dto";
import GetMonthlyTimeSheetDto from './dto/get-timesheet.dto';
import { UserService } from "../user/user.service";
import { DepartmentService } from "../department/department.service";
import { MonthlyTimesheeetResponeDto } from './dto/monthly-tinesheet-respone.dto';
import ReviewMonthlyTimesheetDto from './dto/review-monthly-timesheet.dto';
import ReportTimesheetDto from './dto/report-timesheet.dto';
import { NotificationService } from "../notification/notification.service";
import { Prisma } from '@prisma/client';
import { EmailService } from "../common/email.service";
import { RequestUser } from "../common/types";
import * as ExcelJS from 'exceljs';
interface TimesheetReportFilters {
    fromDate?: string;
    toDate?: string;
    employeeId?: string;
    departmentId?: string;
    status?: string;
}
interface TimesheetReportRow {
    id: string;
    code: string;
    monthlyTimesheetID: string;
    timesheetEntryID: string;
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    departmentId: string;
    departmentName: string;
    workDate: string;
    date: string;
    checkIn: string;
    checkOut: string;
    totalHours: number;
    status: string;
    monthlyStatus: string;
    entryStatus: string;
    locked: boolean;
    warnings: string[];
}
interface TimesheetReportSummary {
    totalRecords: number;
    totalEmployees: number;
    totalHours: number;
    pending: number;
    submitted: number;
    approved: number;
    rejected: number;
    missingOut: number;
    warningRecords: number;
    byStatus: Record<string, number>;
}
interface TimesheetReportData {
    filters: TimesheetReportFilters;
    rows: TimesheetReportRow[];
    summary: TimesheetReportSummary;
}
export declare class MonthlyTimeSheetService {
    private readonly prismaService;
    private readonly userService;
    private readonly departmentService;
    private readonly notificationService;
    private readonly emailService;
    constructor(prismaService: PrismaService, userService: UserService, departmentService: DepartmentService, notificationService: NotificationService, emailService: EmailService);
    refreshCanSubmit(monthlyTimesheetID: string, tx?: Prisma.TransactionClient): Promise<boolean>;
    getMonthlyTimeSheet(userID: string, getMonthlyTimeSheetDto: GetMonthlyTimeSheetDto, tx?: Prisma.TransactionClient): Promise<ResponseDto<MonthlyTimesheeetResponeDto>>;
    getTimesheetReport(query: ReportTimesheetDto, currentUser?: RequestUser): Promise<TimesheetReportData>;
    getMonthlyTimesheetsForReview(month: number, year: number, currentManagerId?: string): Promise<DefaultResponse>;
    exportPersonalTimesheetCsv(userID: string, month: number, year: number, format?: string): Promise<string>;
    private buildCsvFromEntries;
    private formatDateTime;
    private csvEscape;
    private normalizeReportFilters;
    private cleanFilterValue;
    private normalizeReportStatusFilter;
    private toMonthlyStatusFilter;
    private getUserDepartmentID;
    private toReportRow;
    private toReportDisplayStatus;
    private buildReportWarnings;
    private formatTime;
    private calculateEntryHours;
    private buildTimesheetReportSummary;
    createMonthlyTimeSheet(userID: string, createMonthlyTimeSheetDto: CreateMonthlyTimeSheetDto, tx?: Prisma.TransactionClient): Promise<ResponseDto<MonthlyTimesheeetResponeDto>>;
    SubmitMonthlyTimesheet(monthlyTimesheetID: string, tx?: Prisma.TransactionClient): Promise<DefaultResponse>;
    reviewMonthlyTimesheet(monthlyTimesheetID: string, reviewMonthlyTimesheetDto: ReviewMonthlyTimesheetDto, reviewerID?: string, tx?: Prisma.TransactionClient): Promise<ResponseDto<MonthlyTimesheeetResponeDto>>;
    exportTimesheetCsv(userID: string, month: number, year: number): Promise<string>;
    exportDepartmentTimesheetCsv(departmentID: string, month: number, year: number): Promise<string>;
    exportPersonalTimesheetExcel(userID: string, month: number, year: number): Promise<ExcelJS.Workbook>;
    exportDepartmentTimesheetExcel(departmentID: string, month: number, year: number): Promise<ExcelJS.Workbook>;
}
export {};
