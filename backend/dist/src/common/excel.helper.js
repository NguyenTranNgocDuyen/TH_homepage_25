"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelHelper = void 0;
const ExcelJS = __importStar(require("exceljs"));
class ExcelHelper {
    static async sendExcel(res, workbook, filename) {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
        await workbook.xlsx.write(res);
        res.end();
    }
    static createTimesheetWorkbook(data, title) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title || 'Timesheet');
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Check In', key: 'checkIn', width: 20 },
            { header: 'Check Out', key: 'checkOut', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Device Info', key: 'deviceInfo', width: 30 },
            { header: 'Notes', key: 'notes', width: 20 },
        ];
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' },
        };
        data.forEach((entry) => {
            worksheet.addRow({
                date: entry.date,
                checkIn: entry.checkIn ? new Date(entry.checkIn).toLocaleString() : '',
                checkOut: entry.checkOut
                    ? new Date(entry.checkOut).toLocaleString()
                    : '',
                status: entry.status,
                deviceInfo: entry.deviceInfo || '',
                notes: entry.notes || '',
            });
        });
        return workbook;
    }
    static createPayrollWorkbook(data, title) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title || 'Payroll');
        worksheet.columns = [
            { header: 'Employee', key: 'employee', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Department', key: 'department', width: 20 },
            { header: 'Month/Year', key: 'monthYear', width: 15 },
            { header: 'Total Hours', key: 'totalHours', width: 15 },
            { header: 'Extra Hours', key: 'totalExtraHours', width: 15 },
            { header: 'Total Salary', key: 'totalSalary', width: 20 },
        ];
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCEEFF' },
        };
        data.forEach((p) => {
            worksheet.addRow({
                employee: p.employee?.username || '',
                email: p.employee?.email || '',
                department: p.employee?.department?.departmentName || '',
                monthYear: `${p.month}/${p.year}`,
                totalHours: p.totalHours.toFixed(2),
                totalExtraHours: p.totalExtraHours.toFixed(2),
                totalSalary: p.totalSalaryByHours.toFixed(2),
            });
        });
        return workbook;
    }
}
exports.ExcelHelper = ExcelHelper;
//# sourceMappingURL=excel.helper.js.map