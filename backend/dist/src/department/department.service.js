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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const code_1 = require("../common/code");
const user_service_1 = require("../user/user.service");
const role_service_1 = require("../role/role.service");
let DepartmentService = class DepartmentService {
    prismaService;
    userService;
    roleService;
    constructor(prismaService, userService, roleService) {
        this.prismaService = prismaService;
        this.userService = userService;
        this.roleService = roleService;
    }
    async findAll() {
        const departments = await this.prismaService.department.findMany();
        return {
            statusCode: code_1.OK_CODE,
            message: 'Get all department successfull',
            data: departments,
        };
    }
    async createDepartment(DepartmentDto) {
        const { departmentName, managerID } = DepartmentDto;
        try {
            const { statusCode, message, data } = await this.prismaService.$transaction(async (tx) => {
                const departmentGet = await tx.department.findUnique({
                    where: {
                        departmentName,
                    },
                });
                if (departmentGet)
                    throw new common_1.ConflictException('This department name is exist');
                const newDepartment = await tx.department.create({
                    data: {
                        departmentName,
                        managerID,
                    },
                });
                if (managerID !== undefined) {
                    const managerGet = await tx.user.findUnique({
                        where: {
                            userID: managerID,
                        },
                    });
                    if (managerGet === null)
                        throw new common_1.NotFoundException('This managerID is not found ');
                    const managerRoleGet = await tx.role.findUnique({
                        where: {
                            nameRole: code_1.nameRole_manager,
                        },
                    });
                    if (!managerRoleGet)
                        throw new common_1.NotFoundException('Please create manager role !!!');
                    if (managerRoleGet.roleID === managerGet.roleId) {
                        throw new common_1.ConflictException('This managerID is manager of another departmnet!!');
                    }
                    await tx.user.update({
                        where: {
                            userID: managerGet.userID,
                        },
                        data: {
                            roleId: managerRoleGet.roleID,
                            departmentID: newDepartment.departmentID,
                        },
                    });
                }
                return {
                    statusCode: code_1.CREATED_RESPONE,
                    message: 'Create Department Succeessfull !!!!',
                    data: newDepartment,
                };
            });
            return {
                statusCode,
                message,
                data,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.InternalServerErrorException(getErrorMessage(error));
        }
    }
    async getDepartmentById(departmentID, tx) {
        const db = tx ?? this.prismaService;
        const department = await db.department.findUnique({
            where: {
                departmentID,
            },
        });
        if (!department)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: `departmentID = ${departmentID} is NOT FOUND`,
            };
        return {
            statusCode: code_1.OK_CODE,
            message: `get department has id = ${departmentID} is successfull`,
            data: department,
        };
    }
    async getDepartmentByDeparmentName(departmentName) {
        const department = await this.prismaService.department.findUnique({
            where: {
                departmentName,
            },
        });
        if (!department)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: `The department has name = ${departmentName} is not found`,
            };
        return {
            statusCode: code_1.OK_CODE,
            message: `Get department has departmentName = ${departmentName} successfull`,
            data: department,
        };
    }
    async updateDepartment(id, dto) {
        const { departmentName, managerID } = dto;
        try {
            return await this.prismaService.$transaction(async (tx) => {
                const currentDept = await tx.department.findUnique({
                    where: { departmentID: id },
                });
                if (!currentDept)
                    throw new common_1.NotFoundException('Department not found');
                if (departmentName && departmentName !== currentDept.departmentName) {
                    const nameCheck = await tx.department.findUnique({
                        where: { departmentName },
                    });
                    if (nameCheck)
                        throw new common_1.ConflictException('Department name already exists');
                }
                if (managerID !== undefined && managerID !== currentDept.managerID) {
                    await this.handleManagerTransfer(tx, id, currentDept.managerID, managerID);
                }
                const updatedDepartment = await tx.department.update({
                    where: { departmentID: id },
                    data: { departmentName, managerID },
                });
                return {
                    statusCode: code_1.OK_CODE,
                    message: 'Update Department Successful',
                    data: updatedDepartment,
                };
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.InternalServerErrorException(getErrorMessage(error));
        }
    }
    async deleteDepartment(id) {
        try {
            await this.prismaService.department.delete({
                where: { departmentID: id },
            });
            return {
                statusCode: code_1.OK_CODE,
                message: 'Delete Department Successfully',
            };
        }
        catch (error) {
            const code = getPrismaErrorCode(error);
            if (code === 'P2003') {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Cannot delete this department because there are still employees in it.',
                };
            }
            if (code === 'P2025') {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Department not found.',
                };
            }
            throw new common_1.InternalServerErrorException(getErrorMessage(error));
        }
    }
    async handleManagerTransfer(tx, departmentID, currentManagerID, newManagerID) {
        if (currentManagerID && currentManagerID !== newManagerID) {
            const employeeRole = await tx.role.findUnique({
                where: { nameRole: code_1.nameRole_emloyee },
            });
            if (!employeeRole) {
                throw new common_1.NotFoundException('Employee role not found');
            }
            await tx.user.update({
                where: { userID: currentManagerID },
                data: { roleId: employeeRole.roleID },
            });
        }
        if (newManagerID) {
            const newManager = await tx.user.findUnique({
                where: { userID: newManagerID },
            });
            if (!newManager)
                throw new common_1.NotFoundException('New Manager not found');
            const managerRole = await tx.role.findUnique({
                where: { nameRole: code_1.nameRole_manager },
            });
            if (!managerRole) {
                throw new common_1.NotFoundException('Manager role not found');
            }
            if (newManager.roleId === managerRole.roleID &&
                newManager.departmentID !== departmentID) {
                throw new common_1.ConflictException('This user is already managing another department');
            }
            await tx.user.update({
                where: { userID: newManagerID },
                data: {
                    roleId: managerRole.roleID,
                    departmentID: departmentID,
                },
            });
        }
    }
};
exports.DepartmentService = DepartmentService;
exports.DepartmentService = DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_service_1.UserService,
        role_service_1.RoleService])
], DepartmentService);
function getErrorMessage(error) {
    return error instanceof Error ? error.message : 'Internal Server Error';
}
function getPrismaErrorCode(error) {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return undefined;
    }
    const code = error.code;
    return typeof code === 'string' ? code : undefined;
}
//# sourceMappingURL=department.service.js.map