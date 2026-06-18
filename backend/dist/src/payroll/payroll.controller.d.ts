import type { Response } from 'express';
import { PayrollService } from './payroll.service';
import { GetPayrollQueryDto } from './dto/get-payroll-query.dto';
import { ExportPayrollQueryDto } from './dto/export-payroll-query.dto';
import { DefaultResponse } from "../common/response.dto";
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    generatePayroll(monthlyTimesheetID: string): Promise<DefaultResponse>;
    getMyPayroll(userID: string, query: GetPayrollQueryDto): Promise<DefaultResponse>;
    getDepartmentPayroll(departmentID: string, query: GetPayrollQueryDto): Promise<DefaultResponse>;
    exportPayroll(query: ExportPayrollQueryDto, res: Response): Promise<void>;
    exportPayrollExcel(query: ExportPayrollQueryDto, res: Response): Promise<void>;
}
