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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const XLSX = __importStar(require("xlsx"));
const prisma_service_1 = require("../prisma/prisma.service");
const role_service_1 = require("../role/role.service");
const bycypt_hashed_service_1 = require("../common/bycypt-hashed/bycypt-hashed.service");
const code_1 = require("../common/code");
const department_service_1 = require("../department/department.service");
const cloudinary_service_1 = require("../common/cloudinary/cloudinary.service");
let UserService = class UserService {
    prismaService;
    roleService;
    bcryptHashedService;
    departmentService;
    cloudinaryService;
    constructor(prismaService, roleService, bcryptHashedService, departmentService, cloudinaryService) {
        this.prismaService = prismaService;
        this.roleService = roleService;
        this.bcryptHashedService = bcryptHashedService;
        this.departmentService = departmentService;
        this.cloudinaryService = cloudinaryService;
    }
    async getAllUser() {
        const users = await this.prismaService.user.findMany({
            include: {
                role: true,
                department: true,
            },
        });
        const sanitizedUsers = users.map((user) => {
            const sanitizedUser = {
                ...user,
                roleName: user.role?.nameRole,
                departmentName: user.department?.departmentName,
            };
            delete sanitizedUser.hashedPassword;
            return sanitizedUser;
        });
        return {
            statusCode: code_1.OK_CODE,
            message: 'get all users successfull',
            data: sanitizedUsers,
        };
    }
    async getUserByUserID(userID, tx) {
        const db = tx === undefined ? this.prismaService : tx;
        const user = await db.user.findUnique({
            where: {
                userID,
            },
            include: {
                role: true,
                department: {
                    include: {
                        manager: {
                            select: { username: true, email: true },
                        },
                    },
                },
            },
        });
        if (!user)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: 'The user have userid is not found',
            };
        return {
            statusCode: code_1.OK_CODE,
            message: 'get user successfull',
            data: user,
        };
    }
    async getUserByUserName(username, tx) {
        const db = tx === undefined ? this.prismaService : tx;
        const user = await db.user.findUnique({
            where: {
                username,
            },
            include: {
                role: true,
                department: {
                    include: {
                        manager: {
                            select: { username: true, email: true },
                        },
                    },
                },
            },
        });
        if (!user)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: 'The user have username is not found',
            };
        return {
            statusCode: code_1.OK_CODE,
            message: 'get user successfull',
            data: user,
        };
    }
    async getUserByEmail(email, tx) {
        const db = tx === undefined ? this.prismaService : tx;
        const user = await db.user.findUnique({
            where: {
                email,
            },
            include: {
                role: true,
                department: {
                    include: {
                        manager: {
                            select: { username: true, email: true },
                        },
                    },
                },
            },
        });
        if (!user)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: 'The user have email is not found',
            };
        return {
            statusCode: code_1.OK_CODE,
            message: 'get user successfull',
            data: user,
        };
    }
    async createUser(createUserDto) {
        const { username, email, password, roleName, departmentName, linkAvatar, phone, address, emergencyContact, salaryCoefficient, birthday, remainDaysofLeave, totalDaysofLeave, isActive, refreshToken, } = createUserDto;
        try {
            const [existingUser, roleResult, deptResult] = await Promise.all([
                this.prismaService.user.findFirst({
                    where: { OR: [{ username }, { email }] },
                }),
                this.roleService.getRoleByRoleName(roleName || code_1.nameRole_emloyee),
                departmentName
                    ? this.prismaService.department.findUnique({
                        where: { departmentName },
                    })
                    : Promise.resolve(null),
            ]);
            if (existingUser) {
                return {
                    statusCode: code_1.CONFLIG_CODE,
                    message: existingUser.username === username
                        ? 'Username already exists'
                        : 'Email already exists',
                };
            }
            if (!roleResult ||
                roleResult.statusCode !== code_1.OK_CODE ||
                roleResult.data === undefined) {
                return { statusCode: code_1.NOTFOUND_CODE, message: 'Role not found' };
            }
            const isManagerAction = roleResult.data.nameRole === code_1.nameRole_manager ? true : false;
            if (departmentName && !deptResult) {
                return { statusCode: code_1.NOTFOUND_CODE, message: 'Department not found' };
            }
            if (isManagerAction && departmentName === undefined) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'A Manager must be assigned to a department',
                };
            }
            if (!password) {
                return { statusCode: code_1.BADREQUEST_CODE, message: 'Password is required' };
            }
            const hashedPassword = await this.bcryptHashedService.hash(password);
            const newUser = await this.prismaService.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        username,
                        email,
                        hashedPassword,
                        roleId: roleResult.data?.roleID || '',
                        departmentID: deptResult?.departmentID || null,
                        linkAvatar,
                        phone,
                        address,
                        emergencyContact,
                        salaryCoefficient,
                        birthday,
                        remainDaysofLeave,
                        totalDaysofLeave,
                        isActive,
                        refreshToken,
                    },
                });
                if (isManagerAction && deptResult) {
                    await this.departmentService.handleManagerTransfer(tx, deptResult.departmentID, deptResult.managerID, user.userID);
                    await tx.department.update({
                        where: { departmentID: deptResult.departmentID },
                        data: { managerID: user.userID },
                    });
                }
                return user;
            });
            const { hashedPassword: _, ...userDto } = newUser;
            return {
                statusCode: code_1.CREATED_RESPONE,
                message: isManagerAction
                    ? 'Create User and assigned as Manager successfully'
                    : 'Create User successfully',
                data: userDto,
            };
        }
        catch (error) {
            console.error('Error in createUser:', error);
            if (error &&
                typeof error === 'object' &&
                'getStatus' in error &&
                typeof error.getStatus === 'function') {
                const nestError = error;
                return {
                    statusCode: nestError.getStatus(),
                    message: nestError.message,
                };
            }
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'another error',
            };
        }
    }
    async importEmployeesFromExcel(file) {
        if (!file) {
            return {
                importedCount: 0,
                errors: [{ row: 0, message: 'Vui long chon file Excel de import.' }],
                successes: [],
            };
        }
        if (!isExcelFile(file.originalname)) {
            return {
                importedCount: 0,
                errors: [{ row: 0, message: 'Chi chap nhan file .xlsx hoac .xls.' }],
                successes: [],
            };
        }
        let sheetRows = [];
        try {
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = firstSheetName ? workbook.Sheets[firstSheetName] : null;
            sheetRows = worksheet
                ? XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: '',
                    raw: false,
                })
                : [];
        }
        catch {
            return {
                importedCount: 0,
                errors: [{ row: 0, message: 'Khong the doc noi dung file Excel.' }],
                successes: [],
            };
        }
        if (sheetRows.length < 2) {
            return {
                importedCount: 0,
                errors: [{ row: 0, message: 'File Excel chua co du lieu nhan vien.' }],
                successes: [],
            };
        }
        const headerMap = buildHeaderMap(sheetRows[0]);
        const requiredHeaders = [
            'username',
            'email',
            'mat khau tam thoi',
            'phong ban',
            'vai tro',
        ];
        const missingHeaders = requiredHeaders.filter((header) => !headerMap.has(header));
        if (missingHeaders.length > 0) {
            return {
                importedCount: 0,
                errors: [
                    {
                        row: 1,
                        message: `Thieu cot bat buoc: ${missingHeaders.join(', ')}.`,
                    },
                ],
                successes: [],
            };
        }
        const [existingUsers, roles, departments] = await Promise.all([
            this.prismaService.user.findMany({
                select: { email: true, username: true },
            }),
            this.prismaService.role.findMany(),
            this.prismaService.department.findMany(),
        ]);
        const existingEmails = new Set(existingUsers.map((user) => user.email.trim().toLowerCase()));
        const existingUsernames = new Set(existingUsers.map((user) => user.username.trim().toLowerCase()));
        const rolesByName = new Map(roles.map((role) => [normalizeImportText(role.nameRole), role]));
        const departmentsByName = new Map(departments.map((department) => [
            normalizeImportText(department.departmentName),
            department,
        ]));
        registerDepartmentAliases(departmentsByName, departments);
        const seenEmails = new Set();
        const seenUsernames = new Set();
        const rows = [];
        const errors = [];
        sheetRows.slice(1).forEach((row, index) => {
            const rowNumber = index + 2;
            if (isEmptyExcelRow(row)) {
                return;
            }
            const username = getCellValue(row, headerMap, 'username');
            const email = getCellValue(row, headerMap, 'email').toLowerCase();
            const password = getCellValue(row, headerMap, 'mat khau tam thoi');
            const departmentName = getCellValue(row, headerMap, 'phong ban');
            const rawRoleName = getCellValue(row, headerMap, 'vai tro');
            const salaryCoefficient = parseImportNumber(getCellValue(row, headerMap, 'he so luong'), 0);
            const leaveBalance = parseImportNumber(getCellValue(row, headerMap, 'so ngay phep mac dinh'), 12);
            const isActive = parseImportStatus(getCellValue(row, headerMap, 'trang thai'));
            const normalizedRoleName = normalizeImportRole(rawRoleName);
            const matchedDepartment = departmentsByName.get(normalizeImportText(departmentName));
            const rowErrors = [];
            if (!username) {
                rowErrors.push('Username khong duoc trong');
            }
            else if (existingUsernames.has(username.toLowerCase())) {
                rowErrors.push('Username da ton tai');
            }
            else if (seenUsernames.has(username.toLowerCase())) {
                rowErrors.push('Username bi trung trong file');
            }
            if (!email) {
                rowErrors.push('Email khong duoc trong');
            }
            else if (!isValidEmail(email)) {
                rowErrors.push('Email khong hop le');
            }
            else if (existingEmails.has(email)) {
                rowErrors.push('Email da ton tai');
            }
            else if (seenEmails.has(email)) {
                rowErrors.push('Email bi trung trong file');
            }
            if (!password) {
                rowErrors.push('Mat khau tam thoi khong duoc trong');
            }
            if (!normalizedRoleName ||
                !rolesByName.has(normalizeImportText(normalizedRoleName))) {
                rowErrors.push('Vai tro khong hop le');
            }
            if (!departmentName) {
                rowErrors.push('Phong ban khong duoc trong');
            }
            else if (!matchedDepartment) {
                rowErrors.push('Phong ban khong ton tai');
            }
            if (salaryCoefficient <= 0) {
                rowErrors.push('He so luong phai lon hon 0');
            }
            if (leaveBalance < 0) {
                rowErrors.push('So ngay phep mac dinh khong duoc am');
            }
            if (rowErrors.length > 0) {
                rowErrors.forEach((message) => errors.push({ row: rowNumber, message }));
                return;
            }
            seenEmails.add(email);
            seenUsernames.add(username.toLowerCase());
            rows.push({
                rowNumber,
                username,
                email,
                password,
                departmentName: matchedDepartment?.departmentName,
                roleName: normalizedRoleName,
                salaryCoefficient,
                leaveBalance,
                isActive,
            });
        });
        if (rows.length === 0 && errors.length === 0) {
            errors.push({
                row: 0,
                message: 'File Excel khong co dong du lieu hop le.',
            });
        }
        let importedCount = 0;
        const importErrors = [];
        const successes = [];
        for (const row of rows) {
            const result = await this.createUser({
                username: row.username,
                email: row.email,
                password: row.password,
                roleName: row.roleName,
                departmentName: row.departmentName,
                salaryCoefficient: row.salaryCoefficient,
                remainDaysofLeave: row.leaveBalance,
                totalDaysofLeave: row.leaveBalance,
                isActive: row.isActive,
            });
            if (result.statusCode === code_1.CREATED_RESPONE) {
                const successResult = result;
                importedCount += 1;
                successes.push({
                    row: row.rowNumber,
                    userID: successResult.data?.userID || '',
                    username: row.username,
                });
            }
            else {
                importErrors.push({
                    row: row.rowNumber,
                    message: result.message || 'Khong the import nhan vien',
                });
            }
        }
        return { importedCount, errors: [...errors, ...importErrors], successes };
    }
    async updateUser(userID, updateUserDto) {
        const { password, linkAvatar, phone, address, emergencyContact, salaryCoefficient, birthday, remainDaysofLeave, totalDaysofLeave, isActive, roleName, departmentName, refreshToken, } = updateUserDto;
        try {
            const existingUser = await this.prismaService.user.findUnique({
                where: { userID },
                include: { role: true },
            });
            if (!existingUser)
                return { statusCode: code_1.NOTFOUND_CODE, message: 'User not found' };
            const roleResult = roleName
                ? await this.roleService.getRoleByRoleName(roleName)
                : null;
            if (roleName && (!roleResult || roleResult.statusCode !== code_1.OK_CODE)) {
                return { statusCode: code_1.NOTFOUND_CODE, message: 'Role not found' };
            }
            const deptResult = departmentName
                ? await this.departmentService.getDepartmentByDeparmentName(departmentName)
                : null;
            if (departmentName &&
                (!deptResult || deptResult.statusCode !== code_1.OK_CODE)) {
                return { statusCode: code_1.NOTFOUND_CODE, message: 'Department not found' };
            }
            const targetRoleName = roleName ? roleName : existingUser.role.nameRole;
            const targetRoleID = roleResult
                ? roleResult.data?.roleID
                : existingUser.roleId;
            const targetDeptID = departmentName
                ? deptResult?.data?.departmentID
                : existingUser.departmentID;
            if (targetRoleName === code_1.nameRole_manager && !targetDeptID) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'A Manager must be assigned to a department',
                };
            }
            const hashedPassword = password
                ? await this.bcryptHashedService.hash(password)
                : undefined;
            const updatedUser = await this.prismaService.$transaction(async (tx) => {
                const currentManagingDept = await tx.department.findFirst({
                    where: { managerID: userID },
                });
                if (targetRoleName === code_1.nameRole_emloyee) {
                    if (currentManagingDept) {
                        await tx.department.update({
                            where: { departmentID: currentManagingDept.departmentID },
                            data: { managerID: null },
                        });
                    }
                }
                if (targetRoleName === code_1.nameRole_manager && targetDeptID) {
                    if (currentManagingDept &&
                        currentManagingDept.departmentID !== targetDeptID) {
                        await tx.department.update({
                            where: { departmentID: currentManagingDept.departmentID },
                            data: { managerID: null },
                        });
                    }
                    const targetDept = await tx.department.findUnique({
                        where: { departmentID: targetDeptID },
                    });
                    await this.departmentService.handleManagerTransfer(tx, targetDeptID, targetDept?.managerID || null, userID);
                }
                return await tx.user.update({
                    where: { userID },
                    data: {
                        hashedPassword,
                        roleId: targetRoleID,
                        departmentID: targetDeptID,
                        linkAvatar,
                        phone,
                        address,
                        emergencyContact,
                        salaryCoefficient,
                        birthday,
                        remainDaysofLeave,
                        totalDaysofLeave,
                        isActive,
                        refreshToken,
                    },
                });
            });
            const { hashedPassword: _, ...userDto } = updatedUser;
            return {
                statusCode: code_1.OK_CODE,
                message: 'Update User successfully',
                data: userDto,
            };
        }
        catch (error) {
            console.error('Error in updateUser:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error during update',
            };
        }
    }
    async deactivateUser(userID) {
        try {
            const updatedUser = await this.prismaService.user.update({
                where: { userID },
                data: { isActive: false },
            });
            const { hashedPassword: _, ...userDto } = updatedUser;
            return {
                statusCode: code_1.OK_CODE,
                message: 'Deactivate user successfully',
                data: userDto,
            };
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 'P2025') {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'User not found',
                };
            }
            console.error('Error deactivating user:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error during deactivation',
            };
        }
    }
    async activateUser(userID) {
        try {
            const updatedUser = await this.prismaService.user.update({
                where: { userID },
                data: { isActive: true },
            });
            const { hashedPassword: _, ...userDto } = updatedUser;
            return {
                statusCode: code_1.OK_CODE,
                message: 'Activate user successfully',
                data: userDto,
            };
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 'P2025') {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'User not found',
                };
            }
            console.error('Error activating user:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error during activation',
            };
        }
    }
    async updateSelfProfile(userID, dto) {
        const data = {};
        if (dto.linkAvatar !== undefined)
            data.linkAvatar = dto.linkAvatar;
        if (dto.phone !== undefined)
            data.phone = dto.phone;
        if (dto.address !== undefined)
            data.address = dto.address;
        if (dto.emergencyContact !== undefined) {
            data.emergencyContact = dto.emergencyContact;
        }
        if (dto.birthday !== undefined)
            data.birthday = dto.birthday;
        if (dto.password !== undefined && dto.password.trim() !== '') {
            if (!dto.oldPassword) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Vui lòng nhập mật khẩu cũ',
                };
            }
            const currentUser = await this.prismaService.user.findUnique({
                where: { userID },
                select: { hashedPassword: true },
            });
            if (!currentUser) {
                return { statusCode: code_1.NOTFOUND_CODE, message: 'User not found' };
            }
            const isMatch = await this.bcryptHashedService.compare(dto.oldPassword, currentUser.hashedPassword);
            if (!isMatch) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Mật khẩu cũ không chính xác',
                };
            }
            data.hashedPassword = await this.bcryptHashedService.hash(dto.password);
        }
        try {
            const updatedUser = await this.prismaService.user.update({
                where: { userID },
                data,
                include: { role: true, department: true },
            });
            const { hashedPassword: _, ...userDto } = updatedUser;
            return {
                statusCode: code_1.OK_CODE,
                message: 'Update self profile successfully',
                data: userDto,
            };
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 'P2025') {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'User not found',
                };
            }
            console.error('Error updating self profile:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error during self profile update',
            };
        }
    }
    async uploadAvatar(userID, file) {
        try {
            const uploadResult = (await this.cloudinaryService.uploadFile(file));
            const linkAvatar = String(uploadResult.secure_url || '');
            const updatedUser = await this.prismaService.user.update({
                where: { userID },
                data: { linkAvatar },
            });
            const { hashedPassword: _, ...userDto } = updatedUser;
            return {
                statusCode: code_1.OK_CODE,
                message: 'Avatar uploaded successfully',
                data: userDto,
            };
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 'P2025') {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'User not found',
                };
            }
            console.error('Error uploading avatar:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error during avatar upload',
            };
        }
    }
    async deleteUser(userID) {
        return this.deactivateUser(userID);
    }
    async checkIsManager(userId) {
        if (!userId)
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'userID is undefined',
            };
        const { statusCode, message, data } = await this.getUserByUserID(userId);
        if (statusCode !== code_1.OK_CODE)
            return {
                statusCode,
                message: 'user id is not found',
            };
        const roleFetch = await this.roleService.findOne(data?.roleId || '');
        if (roleFetch.statusCode !== code_1.OK_CODE)
            return {
                statusCode,
                message,
            };
        if (roleFetch.data?.nameRole.toLocaleLowerCase() === 'manager') {
            return {
                statusCode: code_1.OK_CODE,
                message: 'This user is manager',
            };
        }
        return {
            statusCode: code_1.BADREQUEST_CODE,
            message: 'This user is not manager',
        };
    }
    async checkAuthIsAdmin(currentUser) {
        const roleName = String(currentUser?.roleName || currentUser?.role || '').toLowerCase();
        if (roleName === 'admin' || roleName === 'hr')
            return {
                statusCode: code_1.OK_CODE,
                message: 'This role is admin/hr role',
            };
        if (currentUser.roleId === undefined)
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'roleID is null',
            };
        const { statusCode, message } = await this.roleService.isAdmin(currentUser.roleId);
        return {
            statusCode,
            message,
        };
    }
    async checkAuthIsMyManager(currentUser, input, type) {
        const { userID, departmentID } = currentUser;
        if (userID === undefined || departmentID === undefined)
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'userID or departmentID is undefined',
            };
        const checkIsManager = await this.checkIsManager(userID);
        if (checkIsManager.statusCode !== code_1.OK_CODE)
            return {
                statusCode: checkIsManager.statusCode,
                message: checkIsManager.message,
            };
        let userResult = null;
        if (type === 'userID') {
            userResult = await this.getUserByUserID(input);
        }
        else if (type === 'email') {
            userResult = await this.getUserByEmail(input);
        }
        else if (type === 'username') {
            userResult = await this.getUserByUserName(input);
        }
        if (!userResult || userResult.statusCode !== code_1.OK_CODE) {
            return {
                message: userResult?.message || 'User not found',
                statusCode: userResult?.statusCode || code_1.NOTFOUND_CODE,
            };
        }
        if (userResult.data !== undefined) {
            if (userResult.data.departmentID === departmentID)
                return {
                    statusCode: code_1.OK_CODE,
                    message: 'This is my manager',
                };
            else
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'This is not my manager',
                };
        }
        return {
            statusCode: code_1.BADREQUEST_CODE,
            message: 'Another error',
        };
    }
    async checkAuthIsManagerOfDepartment(currentUser, input) {
        const { userID, departmentID } = currentUser;
        if (userID === undefined || departmentID === undefined)
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'userID or departmentID is undefined',
            };
        const checkIsManager = await this.checkIsManager(userID);
        if (checkIsManager.statusCode !== code_1.OK_CODE)
            return {
                statusCode: checkIsManager.statusCode,
                message: checkIsManager.message,
            };
        if (departmentID === input)
            return {
                statusCode: code_1.OK_CODE,
                message: 'This is my manager of department',
            };
        else {
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'This is not manager of department',
            };
        }
    }
    IsMe(currentUser, input, type) {
        const { userID, username, email } = currentUser;
        if (type === 'userID') {
            if (userID == undefined)
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'userID is undefined',
                };
            if (userID == input)
                return {
                    statusCode: code_1.OK_CODE,
                    message: "It's me!!!",
                };
            else
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: "It's not me",
                };
        }
        else if (type === 'email') {
            if (email == undefined)
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'email is undefined',
                };
            if (email == input)
                return {
                    statusCode: code_1.OK_CODE,
                    message: "It's me!!!",
                };
            else
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: "It's not me",
                };
        }
        else if (type === 'username') {
            if (username == undefined)
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'username is undefined',
                };
            if (username == input)
                return {
                    statusCode: code_1.OK_CODE,
                    message: "It's me!!!",
                };
            else
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: "It's not me",
                };
        }
        return {
            statusCode: code_1.BADREQUEST_CODE,
            message: 'Another Error',
        };
    }
    async getAllUserOfDepartment(departmentID) {
        if (departmentID === undefined) {
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'DepartmentID cannot undefined',
            };
        }
        const department = await this.departmentService.getDepartmentById(departmentID);
        if (department.statusCode !== code_1.OK_CODE)
            return {
                statusCode: department.statusCode,
                message: department.message,
            };
        const users = (await this.prismaService.user.findMany({
            where: {
                departmentID,
            },
            include: {
                role: true,
            },
        }));
        return {
            statusCode: code_1.OK_CODE,
            message: 'Get user by department is ok ',
            data: users,
        };
    }
    async getManagerIdOfUserID(userID, tx) {
        const userGet = await this.getUserByUserID(userID, tx);
        if (userGet.statusCode !== code_1.OK_CODE || userGet.data === undefined)
            return {
                statusCode: userGet.statusCode,
                message: userGet.message,
            };
        if (userGet.data.departmentID == undefined)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: 'user is not in any department',
            };
        const departmentGet = await this.departmentService.getDepartmentById(userGet.data.departmentID, tx);
        if (departmentGet.statusCode !== code_1.OK_CODE ||
            departmentGet.data === undefined)
            return {
                statusCode: departmentGet.statusCode,
                message: departmentGet.message,
            };
        if (departmentGet.data.managerID === undefined)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: 'This department dont have manager',
            };
        return {
            statusCode: code_1.OK_CODE,
            message: 'get departmentID successfull',
            data: {
                managerID: departmentGet.data.managerID,
            },
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        role_service_1.RoleService,
        bycypt_hashed_service_1.BycyptHashedService,
        department_service_1.DepartmentService,
        cloudinary_service_1.CloudinaryService])
], UserService);
function buildHeaderMap(row) {
    const map = new Map();
    row.forEach((cell, index) => {
        const header = normalizeImportText(getRawCellValue(cell));
        if (header) {
            map.set(header, index);
        }
    });
    return map;
}
function getCellValue(row, headerMap, header) {
    const colNumber = headerMap.get(header);
    if (colNumber === undefined) {
        return '';
    }
    return getRawCellValue(row[colNumber]).trim();
}
function getRawCellValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'bigint') {
        return String(value);
    }
    if (typeof value === 'object') {
        const cell = value;
        if (cell.text !== undefined) {
            return getRawCellValue(cell.text);
        }
        if (cell.result !== undefined) {
            return getRawCellValue(cell.result);
        }
        if (Array.isArray(cell.richText)) {
            return cell.richText
                .map((item) => typeof item === 'object' && item !== null
                ? getRawCellValue(item.text)
                : '')
                .join('');
        }
    }
    return '';
}
function isEmptyExcelRow(row) {
    return row.every((value) => !getRawCellValue(value));
}
function isExcelFile(fileName) {
    return /\.(xlsx|xls)$/i.test(fileName || '');
}
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function normalizeImportText(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ');
}
function normalizeImportKey(value) {
    return normalizeImportText(value).replace(/[^a-z0-9]+/g, '');
}
function registerDepartmentAliases(departmentsByName, departments) {
    departments.forEach((department) => {
        const key = normalizeImportKey(department.departmentName);
        const aliases = [];
        if (key.includes('kythuat') ||
            key.includes('kathuat') ||
            key.includes('thuaat') ||
            key.includes('thuat') ||
            key === 'it') {
            aliases.push('phong ky thuat', 'it', 'engineering');
        }
        if (key.includes('nhansu') ||
            key.includes('nhansa') ||
            key.includes('nhaans') ||
            key === 'hr') {
            aliases.push('phong nhan su', 'hr', 'human resources');
        }
        if (key.includes('kinhdoanh') || key.includes('sales')) {
            aliases.push('phong kinh doanh', 'sales', 'business');
        }
        aliases.forEach((alias) => {
            departmentsByName.set(normalizeImportText(alias), department);
        });
    });
}
function normalizeImportRole(value) {
    const normalized = normalizeImportText(value).replace(/[\s_-]+/g, '');
    if (normalized === 'hr' ||
        normalized === 'admin' ||
        normalized === 'hradmin') {
        return 'admin';
    }
    if (normalized === 'manager' || normalized === 'quanly') {
        return 'manager';
    }
    if (normalized === 'employee' || normalized === 'nhanvien') {
        return 'employee';
    }
    return value.trim();
}
function parseImportNumber(value, fallback) {
    if (!value) {
        return fallback;
    }
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : Number.NaN;
}
function parseImportStatus(value) {
    const normalized = normalizeImportText(value).replace(/[\s_-]+/g, '');
    if (!normalized) {
        return true;
    }
    return !['inactive', 'khonghoatdong', 'vohieuhoa', 'false', '0'].includes(normalized);
}
//# sourceMappingURL=user.service.js.map