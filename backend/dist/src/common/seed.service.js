"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bycypt_hashed_service_1 = require("./bycypt-hashed/bycypt-hashed.service");
const prisma_service_1 = require("../prisma/prisma.service");
const DEMO_PASSWORD = 'password123';
const ROLE_NAMES = ['admin', 'manager', 'employee'];
const DEPARTMENTS = {
    engineering: 'Phòng Kỹ thuật',
    hr: 'Phòng Nhân sự',
    sales: 'Phòng Kinh doanh',
};
const LEGACY_DEPARTMENT_NAMES = {
    engineering: ['PhÃ²ng Ká»¹ thuáº­t'],
    hr: ['PhÃ²ng NhÃ¢n sá»±'],
    sales: ['PhÃ²ng Kinh doanh'],
};
const LEAVE_TYPES = {
    annual: { code: 'AL', nameTypeLeave: 'Nghỉ phép năm', hasSalary: 1 },
    unpaid: { code: 'UP', nameTypeLeave: 'Nghỉ không lương', hasSalary: 0 },
    sick: { code: 'SL', nameTypeLeave: 'Nghỉ ốm', hasSalary: 1 },
    wedding: { code: 'ML', nameTypeLeave: 'Nghỉ cưới', hasSalary: 1 },
};
const LEGACY_LEAVE_TYPE_NAMES = {
    annual: ['Nghá»‰ phÃ©p nÄƒm'],
    unpaid: ['Nghá»‰ khÃ´ng lÆ°Æ¡ng'],
    sick: ['Nghá»‰ á»‘m'],
    wedding: ['Nghá»‰ cÆ°á»›i'],
};
const DEMO_USERS = {
    hrAdmin: {
        email: 'hr@company.com',
        username: 'HR Admin',
        roleName: 'admin',
        departmentKey: 'hr',
        salaryCoefficient: 3,
    },
    managerKt: {
        email: 'manager.kt@company.com',
        username: 'Manager KT',
        roleName: 'manager',
        departmentKey: 'engineering',
        salaryCoefficient: 2.6,
    },
    employee1: {
        email: 'nguyentranngocduyen11a1@gmail.com',
        username: 'Ngọc Duyên',
        roleName: 'employee',
        departmentKey: 'engineering',
        salaryCoefficient: 1.35,
    },
    employee2: {
        email: 'nv2@company.com',
        username: 'Employee 2',
        roleName: 'employee',
        departmentKey: 'engineering',
        salaryCoefficient: 1.45,
        remainDaysofLeave: 11,
    },
    employeeOT: {
        email: 'nv_ot@company.com',
        username: 'Employee OT',
        roleName: 'employee',
        departmentKey: 'engineering',
        salaryCoefficient: 1.5,
    },
    employeeRejected: {
        email: 'nv_rejected@company.com',
        username: 'Employee Rejected',
        roleName: 'employee',
        departmentKey: 'sales',
        salaryCoefficient: 1.2,
    },
    employeePending: {
        email: 'nv_pending@company.com',
        username: 'Employee Pending',
        roleName: 'employee',
        departmentKey: 'sales',
        salaryCoefficient: 1.25,
    },
};
let SeedService = SeedService_1 = class SeedService {
    prisma;
    bcrypt;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(prisma, bcrypt) {
        this.prisma = prisma;
        this.bcrypt = bcrypt;
    }
    async onModuleInit() {
        if (process.env.SKIP_AUTO_SEED === 'true') {
            this.logger.log('SKIP_AUTO_SEED=true, bỏ qua seed tự động.');
            return;
        }
        if (await this.isDatabaseEmpty()) {
            await this.seedDemoData({ force: true });
            return;
        }
        this.logger.log('Database đã có dữ liệu, bỏ qua seed tự động.');
    }
    async seedDemoData(options = {}) {
        if (!options.force && !(await this.isDatabaseEmpty())) {
            this.logger.log('Database không trống, chỉ chạy seed khi gọi npm run seed.');
            return;
        }
        this.logger.log('Đang seed dữ liệu demo...');
        const passwordHash = await this.bcrypt.hash(DEMO_PASSWORD);
        const previousPeriod = this.getPreviousMonthPeriod(new Date());
        const month = previousPeriod.month;
        const year = previousPeriod.year;
        const businessDays = this.getBusinessDays(year, month, 10);
        await this.prisma.$transaction(async (tx) => {
            const roles = await this.seedRoles(tx);
            const departments = await this.seedDepartments(tx);
            const leaveTypes = await this.seedLeaveTypes(tx);
            await this.mergeLegacyDepartments(tx, departments);
            await this.mergeLegacyLeaveTypes(tx, leaveTypes);
            const users = await this.seedUsers(tx, roles, departments, passwordHash);
            await this.assignDepartmentManagers(tx, departments, users);
            const timesheets = await this.seedMonthlyTimesheets(tx, users, businessDays, month, year);
            await this.seedLeaveApplications(tx, users, leaveTypes, month, year);
            await this.seedPayrolls(tx, users, timesheets);
            await this.seedNotifications(tx, users, month, year);
            await this.cleanupLegacySeedData(tx, roles.employee.roleID);
            this.logger.log(`Seed hoàn tất: ${Object.keys(users).length} users, ${Object.keys(timesheets).length} monthly timesheets.`);
        }, {
            timeout: 90000,
        });
    }
    async isDatabaseEmpty() {
        const [roleCount, departmentCount, userCount] = await Promise.all([
            this.prisma.role.count(),
            this.prisma.department.count(),
            this.prisma.user.count(),
        ]);
        return roleCount === 0 && departmentCount === 0 && userCount === 0;
    }
    getPreviousMonthPeriod(date) {
        let month = date.getMonth();
        let year = date.getFullYear();
        if (month === 0) {
            month = 12;
            year -= 1;
        }
        return { month, year };
    }
    async seedRoles(tx) {
        const existingRoles = await tx.role.findMany({
            where: { nameRole: { in: [...ROLE_NAMES] } },
        });
        const existingNames = new Set(existingRoles.map((r) => r.nameRole));
        const missingNames = ROLE_NAMES.filter((name) => !existingNames.has(name));
        if (missingNames.length > 0) {
            await tx.role.createMany({
                data: missingNames.map((nameRole) => ({ nameRole })),
                skipDuplicates: true,
            });
        }
        const allRoles = await tx.role.findMany({
            where: { nameRole: { in: [...ROLE_NAMES] } },
        });
        return Object.fromEntries(allRoles.map((role) => [role.nameRole, role]));
    }
    async seedDepartments(tx) {
        const entries = await Promise.all(Object.entries(DEPARTMENTS).map(async ([key, departmentName]) => {
            const department = await tx.department.upsert({
                where: { departmentName },
                update: { departmentName },
                create: { departmentName },
            });
            return [key, department];
        }));
        return Object.fromEntries(entries);
    }
    async seedLeaveTypes(tx) {
        const entries = await Promise.all(Object.entries(LEAVE_TYPES).map(async ([key, data]) => {
            const existing = await tx.typeLeave.findFirst({
                where: { nameTypeLeave: data.nameTypeLeave },
            });
            const typeLeave = existing
                ? await tx.typeLeave.update({
                    where: { typeLeaveID: existing.typeLeaveID },
                    data,
                })
                : await tx.typeLeave.create({ data });
            return [key, typeLeave];
        }));
        return Object.fromEntries(entries);
    }
    async seedUsers(tx, roles, departments, passwordHash) {
        const entries = await Promise.all(Object.entries(DEMO_USERS).map(async ([key, config]) => {
            const user = await this.upsertUser(tx, {
                email: config.email,
                username: config.username,
                roleId: roles[config.roleName].roleID,
                departmentID: departments[config.departmentKey].departmentID,
                salaryCoefficient: config.salaryCoefficient,
                remainDaysofLeave: config.remainDaysofLeave,
                hashedPassword: passwordHash,
            });
            return [key, user];
        }));
        return Object.fromEntries(entries);
    }
    async upsertUser(tx, data) {
        const userData = {
            username: data.username,
            hashedPassword: data.hashedPassword,
            roleId: data.roleId,
            departmentID: data.departmentID,
            salaryCoefficient: data.salaryCoefficient,
            remainDaysofLeave: data.remainDaysofLeave ?? 12,
            totalDaysofLeave: 12,
            isActive: true,
        };
        return tx.user.upsert({
            where: { email: data.email },
            update: userData,
            create: {
                email: data.email,
                ...userData,
            },
        });
    }
    async assignDepartmentManagers(tx, departments, users) {
        await Promise.all([
            tx.department.update({
                where: { departmentID: departments.engineering.departmentID },
                data: { managerID: users.managerKt.userID },
            }),
            tx.department.update({
                where: { departmentID: departments.hr.departmentID },
                data: { managerID: users.hrAdmin.userID },
            }),
        ]);
    }
    async seedMonthlyTimesheets(tx, users, businessDays, month, year) {
        const managerTimesheet = await this.upsertMonthlyTimesheet(tx, {
            userID: users.managerKt.userID,
            month,
            year,
            status: client_1.MonthlyTimesheetStatus.DRAFT,
            isSubmitted: false,
            canSubmit: true,
        });
        const employee1Timesheet = await this.upsertMonthlyTimesheet(tx, {
            userID: users.employee1.userID,
            month,
            year,
            status: client_1.MonthlyTimesheetStatus.SUBMITTED,
            isSubmitted: true,
            canSubmit: false,
        });
        const employee2Timesheet = await this.upsertMonthlyTimesheet(tx, {
            userID: users.employee2.userID,
            month,
            year,
            status: client_1.MonthlyTimesheetStatus.APPROVED,
            isSubmitted: true,
            canSubmit: false,
            approvedById: users.managerKt.userID,
            reviewedAt: new Date(),
        });
        const employeeOTTimesheet = await this.upsertMonthlyTimesheet(tx, {
            userID: users.employeeOT.userID,
            month,
            year,
            status: client_1.MonthlyTimesheetStatus.APPROVED,
            isSubmitted: true,
            canSubmit: false,
            approvedById: users.managerKt.userID,
            reviewedAt: new Date(),
        });
        const employeeRejectedTimesheet = await this.upsertMonthlyTimesheet(tx, {
            userID: users.employeeRejected.userID,
            month,
            year,
            status: client_1.MonthlyTimesheetStatus.REJECTED,
            isSubmitted: true,
            canSubmit: false,
            approvedById: users.hrAdmin.userID,
            reviewedAt: new Date(),
            reasonReject: 'Thiếu minh chứng cho các ngày nghỉ không phép.',
        });
        const employeePendingTimesheet = await this.upsertMonthlyTimesheet(tx, {
            userID: users.employeePending.userID,
            month,
            year,
            status: client_1.MonthlyTimesheetStatus.SUBMITTED,
            isSubmitted: true,
            canSubmit: false,
        });
        await this.seedTimesheetEntries(tx, managerTimesheet.monthlyTimesheetID, businessDays, {
            status: client_1.TimesheetStatus.PENDING,
            ipAddress: '192.168.1.10',
            lateOnIndex: 3,
        });
        await this.seedTimesheetEntries(tx, employee1Timesheet.monthlyTimesheetID, businessDays, {
            status: client_1.TimesheetStatus.PENDING,
            ipAddress: '192.168.1.20',
            lateOnIndex: 2,
            missingCheckoutOnIndex: 5,
        });
        await this.seedTimesheetEntries(tx, employee2Timesheet.monthlyTimesheetID, businessDays, {
            status: client_1.TimesheetStatus.APPROVED,
            ipAddress: '192.168.1.21',
            lateOnIndex: 1,
        });
        await this.seedTimesheetEntries(tx, employeeOTTimesheet.monthlyTimesheetID, businessDays, {
            status: client_1.TimesheetStatus.APPROVED,
            ipAddress: '192.168.1.30',
            isOT: true,
        });
        await this.seedTimesheetEntries(tx, employeeRejectedTimesheet.monthlyTimesheetID, businessDays, {
            status: client_1.TimesheetStatus.REJECTED,
            ipAddress: '192.168.1.40',
        });
        await this.seedTimesheetEntries(tx, employeePendingTimesheet.monthlyTimesheetID, businessDays, {
            status: client_1.TimesheetStatus.PENDING,
            ipAddress: '192.168.1.50',
        });
        return {
            managerKt: managerTimesheet,
            employee1: employee1Timesheet,
            employee2: employee2Timesheet,
            employeeOT: employeeOTTimesheet,
            employeeRejected: employeeRejectedTimesheet,
            employeePending: employeePendingTimesheet,
        };
    }
    async upsertMonthlyTimesheet(tx, data) {
        const monthlyTimesheetData = {
            status: data.status,
            isSubmitted: data.isSubmitted,
            canSubmit: data.canSubmit,
            approvedById: data.approvedById ?? null,
            reviewedAt: data.reviewedAt ?? null,
            reasonReject: data.reasonReject ?? null,
        };
        return tx.monthlyTimesheet.upsert({
            where: {
                userID_month_year: {
                    userID: data.userID,
                    month: data.month,
                    year: data.year,
                },
            },
            update: monthlyTimesheetData,
            create: {
                userID: data.userID,
                month: data.month,
                year: data.year,
                ...monthlyTimesheetData,
            },
        });
    }
    async seedTimesheetEntries(tx, monthlyTimesheetID, days, options) {
        const dateKeys = days.map((day) => this.formatDateKey(day));
        const existingEntries = await tx.timesheetEntry.findMany({
            where: {
                monthlyTimesheetID,
                date: { in: dateKeys },
            },
        });
        const existingMap = new Map(existingEntries.map((e) => [e.date, e]));
        for (const [index, day] of days.entries()) {
            const isLate = options.lateOnIndex === index;
            const isMissingCheckout = options.missingCheckoutOnIndex === index;
            const date = this.formatDateKey(day);
            const checkIn = this.withTime(day, isLate ? 8 : 7, isLate ? 45 : 55);
            const checkOut = isMissingCheckout
                ? null
                : this.withTime(day, options.isOT ? 19 : 17, options.isOT ? 30 : index % 3 === 0 ? 45 : 30);
            const existing = existingMap.get(date);
            const data = {
                status: isMissingCheckout ? client_1.TimesheetStatus.PENDING : options.status,
                checkIn,
                checkOut,
                IPAddress: options.ipAddress,
                canRequestCorrection: true,
            };
            if (existing) {
                await tx.timesheetEntry.update({
                    where: { timesheetEntryID: existing.timesheetEntryID },
                    data,
                });
            }
            else {
                await tx.timesheetEntry.create({
                    data: {
                        monthlyTimesheetID,
                        date,
                        ...data,
                    },
                });
            }
        }
    }
    async seedPayrolls(tx, users, timesheets) {
        await this.upsertPayroll(tx, {
            userID: users.employee2.userID,
            month: timesheets.employee2.month,
            year: timesheets.employee2.year,
            monthlyTimesheetID: timesheets.employee2.monthlyTimesheetID,
            totalHours: 160,
            totalExtraHours: 0,
            totalSalaryByHours: 160 * 100000 * users.employee2.salaryCoefficient,
        });
        await this.upsertPayroll(tx, {
            userID: users.employeeOT.userID,
            month: timesheets.employeeOT.month,
            year: timesheets.employeeOT.year,
            monthlyTimesheetID: timesheets.employeeOT.monthlyTimesheetID,
            totalHours: 160,
            totalExtraHours: 25.5,
            totalSalaryByHours: (160 + 25.5 * 1.5) * 100000 * users.employeeOT.salaryCoefficient,
        });
    }
    async upsertPayroll(tx, data) {
        const existing = await tx.payroll.findFirst({
            where: {
                userID: data.userID,
                month: data.month,
                year: data.year,
            },
        });
        const payload = {
            monthlyTimesheetID: data.monthlyTimesheetID,
            totalHours: data.totalHours,
            totalExtraHours: data.totalExtraHours,
            totalSalaryByHours: data.totalSalaryByHours,
        };
        if (existing) {
            return tx.payroll.update({
                where: { payrollID: existing.payrollID },
                data: payload,
            });
        }
        return tx.payroll.create({
            data: {
                userID: data.userID,
                month: data.month,
                year: data.year,
                ...payload,
            },
        });
    }
    async seedLeaveApplications(tx, users, leaveTypes, month, year) {
        await this.upsertLeaveApplication(tx, {
            senderID: users.employee1.userID,
            reviewerID: null,
            typeLeaveID: leaveTypes.annual.typeLeaveID,
            startDate: this.fixedDate(year, month, 12),
            endDate: this.fixedDate(year, month, 13),
            duration: 2,
            reason: 'Nghỉ phép gia đình',
            status: client_1.LeaveStatus.PENDING,
        });
        await this.upsertLeaveApplication(tx, {
            senderID: users.employee2.userID,
            reviewerID: users.managerKt.userID,
            typeLeaveID: leaveTypes.sick.typeLeaveID,
            startDate: this.fixedDate(year, month, 5),
            endDate: this.fixedDate(year, month, 5),
            duration: 1,
            reason: 'Nghỉ ốm có giấy xác nhận',
            status: client_1.LeaveStatus.APPROVED,
            reviewedAt: new Date(),
        });
        await this.upsertLeaveApplication(tx, {
            senderID: users.employee1.userID,
            reviewerID: users.managerKt.userID,
            typeLeaveID: leaveTypes.unpaid.typeLeaveID,
            startDate: this.fixedDate(year, month, 20),
            endDate: this.fixedDate(year, month, 20),
            duration: 1,
            reason: 'Việc cá nhân đột xuất',
            status: client_1.LeaveStatus.REJECTED,
            reasonReject: 'Lịch trực trong ngày đã kín.',
            reviewedAt: new Date(),
        });
    }
    async upsertLeaveApplication(tx, data) {
        const existing = await tx.leaveApplication.findFirst({
            where: {
                senderID: data.senderID,
                typeLeaveID: data.typeLeaveID,
                startDate: data.startDate,
                endDate: data.endDate,
            },
        });
        const payload = {
            reviewerID: data.reviewerID,
            duration: data.duration,
            reason: data.reason,
            status: data.status,
            reasonReject: data.reasonReject ?? null,
            reviewedAt: data.reviewedAt ?? null,
        };
        if (existing) {
            return tx.leaveApplication.update({
                where: { leaveApplicationID: existing.leaveApplicationID },
                data: payload,
            });
        }
        return tx.leaveApplication.create({
            data: {
                senderID: data.senderID,
                typeLeaveID: data.typeLeaveID,
                startDate: data.startDate,
                endDate: data.endDate,
                ...payload,
            },
        });
    }
    async seedNotifications(tx, users, month, year) {
        const currentPeriod = `${String(month).padStart(2, '0')}/${year}`;
        await this.upsertNotification(tx, {
            senderID: users.employee1.userID,
            receiverID: users.managerKt.userID,
            content: `Bảng công tháng ${currentPeriod} của Employee 1 đang chờ duyệt.`,
            relatedType: client_1.NotificationRelatedType.TIMESHEET,
            isRead: false,
            legacyContentIncludes: ['Monthly timesheet', 'Employee 1 needs review'],
        });
        await this.upsertNotification(tx, {
            senderID: users.employee1.userID,
            receiverID: users.managerKt.userID,
            content: 'Employee 1 vừa gửi đơn nghỉ phép năm.',
            relatedType: client_1.NotificationRelatedType.LEAVE,
            isRead: false,
            legacyContentIncludes: ['New leave application submitted by Employee 1'],
        });
        await this.upsertNotification(tx, {
            senderID: users.managerKt.userID,
            receiverID: users.employee2.userID,
            content: 'Đơn nghỉ ốm của bạn đã được duyệt.',
            relatedType: client_1.NotificationRelatedType.LEAVE,
            isRead: true,
            legacyContentIncludes: ['Your sick leave application has been approved'],
        });
        await this.upsertNotification(tx, {
            senderID: users.managerKt.userID,
            receiverID: users.employee1.userID,
            content: 'Đơn nghỉ không lương của bạn đã bị từ chối. Lý do: Lịch trực trong ngày đã kín.',
            relatedType: client_1.NotificationRelatedType.LEAVE,
            isRead: false,
            legacyContentIncludes: [
                'Your unpaid leave application has been rejected',
            ],
        });
        await this.upsertNotification(tx, {
            senderID: null,
            receiverID: users.employee1.userID,
            content: 'Bạn có cảnh báo chấm công: thiếu giờ check-out trong tháng này.',
            relatedType: client_1.NotificationRelatedType.WARNING,
            isRead: false,
            legacyContentIncludes: ['Missed checkout in this month'],
        });
        await this.upsertNotification(tx, {
            senderID: null,
            receiverID: users.hrAdmin.userID,
            content: `Dữ liệu demo chấm công và nghỉ phép tháng ${currentPeriod} đã sẵn sàng.`,
            relatedType: client_1.NotificationRelatedType.TIMESHEET,
            isRead: true,
            legacyContentIncludes: ['Payroll and attendance demo data'],
        });
        await this.upsertNotification(tx, {
            senderID: users.hrAdmin.userID,
            receiverID: users.employeeRejected.userID,
            content: 'Bảng công tháng này của bạn đã bị từ chối. Lý do: Thiếu minh chứng cho các ngày nghỉ không phép.',
            relatedType: client_1.NotificationRelatedType.TIMESHEET,
            isRead: false,
        });
        await this.upsertNotification(tx, {
            senderID: users.employeePending.userID,
            receiverID: users.hrAdmin.userID,
            content: `Nhân viên ${users.employeePending.username} đã gửi bảng công tháng ${currentPeriod} chờ duyệt.`,
            relatedType: client_1.NotificationRelatedType.TIMESHEET,
            isRead: false,
        });
        await this.upsertNotification(tx, {
            senderID: users.employee1.userID,
            receiverID: users.managerKt.userID,
            content: 'Employee 1 vừa gửi yêu cầu chỉnh sửa giờ check-in ngày 15/05.',
            relatedType: client_1.NotificationRelatedType.TIMESHEET,
            isRead: false,
        });
        await this.upsertNotification(tx, {
            senderID: null,
            receiverID: users.employeeOT.userID,
            content: 'Chào mừng! Bạn đã hoàn thành 100% mục tiêu giờ làm việc tuần này.',
            relatedType: client_1.NotificationRelatedType.WARNING,
            isRead: true,
        });
        await this.upsertNotification(tx, {
            senderID: users.hrAdmin.userID,
            receiverID: users.managerKt.userID,
            content: 'Thông báo: Hệ thống sẽ bảo trì vào lúc 23:00 tối nay.',
            relatedType: client_1.NotificationRelatedType.WARNING,
            isRead: false,
        });
    }
    async upsertNotification(tx, data) {
        const senderWhere = data.senderID === null ? { senderID: null } : { senderID: data.senderID };
        const existing = await tx.notification.findFirst({
            where: {
                receiverID: data.receiverID,
                relatedType: data.relatedType,
                ...senderWhere,
                OR: [
                    { content: data.content },
                    ...(data.legacyContentIncludes ?? []).map((content) => ({
                        content: { contains: content },
                    })),
                ],
            },
        });
        const payload = {
            senderID: data.senderID,
            receiverID: data.receiverID,
            content: data.content,
            relatedType: data.relatedType,
            isRead: data.isRead,
        };
        if (existing) {
            return tx.notification.update({
                where: { notificationID: existing.notificationID },
                data: payload,
            });
        }
        return tx.notification.create({ data: payload });
    }
    async mergeLegacyDepartments(tx, departments) {
        for (const [key, legacyNames] of Object.entries(LEGACY_DEPARTMENT_NAMES)) {
            const canonicalDepartment = departments[key];
            const legacyDepartments = await tx.department.findMany({
                where: {
                    departmentName: { in: legacyNames },
                },
            });
            for (const legacyDepartment of legacyDepartments) {
                if (legacyDepartment.departmentID === canonicalDepartment.departmentID) {
                    continue;
                }
                await tx.user.updateMany({
                    where: { departmentID: legacyDepartment.departmentID },
                    data: { departmentID: canonicalDepartment.departmentID },
                });
                await tx.department.delete({
                    where: { departmentID: legacyDepartment.departmentID },
                });
            }
        }
    }
    async mergeLegacyLeaveTypes(tx, leaveTypes) {
        for (const [key, legacyNames] of Object.entries(LEGACY_LEAVE_TYPE_NAMES)) {
            const canonicalType = leaveTypes[key];
            const duplicateTypes = await tx.typeLeave.findMany({
                where: {
                    nameTypeLeave: {
                        in: [canonicalType.nameTypeLeave, ...legacyNames],
                    },
                },
            });
            for (const duplicateType of duplicateTypes) {
                if (duplicateType.typeLeaveID === canonicalType.typeLeaveID) {
                    continue;
                }
                await tx.leaveApplication.updateMany({
                    where: { typeLeaveID: duplicateType.typeLeaveID },
                    data: { typeLeaveID: canonicalType.typeLeaveID },
                });
                const applicationsCount = await tx.leaveApplication.count({
                    where: { typeLeaveID: duplicateType.typeLeaveID },
                });
                if (applicationsCount === 0) {
                    await tx.typeLeave.delete({
                        where: { typeLeaveID: duplicateType.typeLeaveID },
                    });
                }
            }
        }
    }
    async cleanupLegacySeedData(tx, employeeRoleID) {
        const legacyEmployeeRole = await tx.role.findUnique({
            where: { nameRole: 'emloyee' },
        });
        if (legacyEmployeeRole) {
            await tx.user.updateMany({
                where: { roleId: legacyEmployeeRole.roleID },
                data: { roleId: employeeRoleID },
            });
            await this.deleteRoleIfUnused(tx, legacyEmployeeRole.roleID);
        }
        const noneRole = await tx.role.findUnique({
            where: { nameRole: 'none Role' },
        });
        if (noneRole) {
            await this.deleteRoleIfUnused(tx, noneRole.roleID);
        }
        await this.deleteLegacyAdminIfUnused(tx);
    }
    async deleteRoleIfUnused(tx, roleID) {
        const usersInRole = await tx.user.count({ where: { roleId: roleID } });
        if (usersInRole === 0) {
            await tx.role.delete({ where: { roleID } });
        }
    }
    async deleteLegacyAdminIfUnused(tx) {
        const legacyAdmin = await tx.user.findUnique({
            where: { email: 'admin@gmail.com' },
            select: { userID: true, username: true },
        });
        if (!legacyAdmin || legacyAdmin.username !== 'admin') {
            return;
        }
        const relationCounts = await Promise.all([
            tx.department.count({ where: { managerID: legacyAdmin.userID } }),
            tx.monthlyTimesheet.count({ where: { userID: legacyAdmin.userID } }),
            tx.monthlyTimesheet.count({
                where: { approvedById: legacyAdmin.userID },
            }),
            tx.leaveApplication.count({ where: { senderID: legacyAdmin.userID } }),
            tx.leaveApplication.count({ where: { reviewerID: legacyAdmin.userID } }),
            tx.notification.count({ where: { senderID: legacyAdmin.userID } }),
            tx.notification.count({ where: { receiverID: legacyAdmin.userID } }),
            tx.warning.count({ where: { userID: legacyAdmin.userID } }),
            tx.payroll.count({ where: { userID: legacyAdmin.userID } }),
            tx.requestCorrection.count({ where: { userID: legacyAdmin.userID } }),
            tx.requestCorrection.count({ where: { reviewerID: legacyAdmin.userID } }),
        ]);
        if (relationCounts.every((count) => count === 0)) {
            await tx.user.delete({ where: { userID: legacyAdmin.userID } });
        }
    }
    getBusinessDays(year, month, count) {
        const days = [];
        const lastDay = new Date(year, month, 0).getDate();
        for (let day = 1; day <= lastDay && days.length < count; day += 1) {
            const date = new Date(year, month - 1, day);
            const weekday = date.getDay();
            if (weekday !== 0 && weekday !== 6) {
                days.push(date);
            }
        }
        return days;
    }
    fixedDate(year, month, preferredDay) {
        const lastDay = new Date(year, month, 0).getDate();
        return new Date(year, month - 1, Math.min(preferredDay, lastDay), 0, 0, 0, 0);
    }
    withTime(date, hour, minute) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0, 0);
    }
    formatDateKey(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bycypt_hashed_service_1.BycyptHashedService])
], SeedService);
//# sourceMappingURL=seed.service.js.map