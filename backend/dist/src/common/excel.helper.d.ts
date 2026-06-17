import * as ExcelJS from 'exceljs';
import type { Response } from 'express';
export interface TimesheetWorkbookRow {
    date: string;
    checkIn?: Date | string | null;
    checkOut?: Date | string | null;
    status: string;
    deviceInfo?: string | null;
    notes?: string | null;
}
export interface PayrollWorkbookRow {
    employee?: {
        username?: string | null;
        email?: string | null;
        department?: {
            departmentName?: string | null;
        } | null;
    } | null;
    month: number;
    year: number;
    totalHours: number;
    totalExtraHours: number;
    totalSalaryByHours: number;
}
export declare class ExcelHelper {
    static sendExcel(res: Response, workbook: ExcelJS.Workbook, filename: string): Promise<void>;
    static createTimesheetWorkbook(data: TimesheetWorkbookRow[], title: string): ExcelJS.Workbook;
    static createPayrollWorkbook(data: PayrollWorkbookRow[], title: string): ExcelJS.Workbook;
}
