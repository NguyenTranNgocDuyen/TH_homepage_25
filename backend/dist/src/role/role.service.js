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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const code_1 = require("../common/code");
let RoleService = class RoleService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createRoleDto) {
        console.log('Inide role.service.create()');
        const { statusCode } = await this.getRoleByRoleName(createRoleDto.nameRole);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode: code_1.CONFLIG_CODE,
                message: `Name role existed`,
            };
        const role = await this.prismaService.role.create({
            data: {
                nameRole: createRoleDto.nameRole,
            },
        });
        return {
            statusCode: code_1.CREATED_RESPONE,
            message: 'Created successfully',
            data: role,
        };
    }
    async findAll() {
        const roles = await this.prismaService.role.findMany();
        return {
            statusCode: code_1.OK_CODE,
            message: roles.length === 0
                ? 'Hiện chưa có role nào'
                : 'Lấy danh sách role thành công',
            data: roles,
        };
    }
    async findOne(roleID) {
        const role = await this.prismaService.role.findUnique({
            where: {
                roleID,
            },
        });
        if (!role) {
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: 'Role id is not exist',
            };
        }
        return {
            statusCode: code_1.OK_CODE,
            message: `Get role  id = ${roleID} successfull`,
            data: role,
        };
    }
    async update(id, updateRoleDto) {
        const findRoleByID = await this.findOne(id);
        if (findRoleByID.statusCode === code_1.NOTFOUND_CODE ||
            findRoleByID.data === undefined)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: `Role id is not exist`,
            };
        if (findRoleByID.data.nameRole === updateRoleDto.nameRole)
            return {
                statusCode: code_1.CONFLIG_CODE,
                message: 'The name role is the same',
            };
        const findRoleByRoleName = await this.getRoleByRoleName(updateRoleDto.nameRole);
        if (findRoleByRoleName.statusCode === code_1.OK_CODE)
            return {
                statusCode: code_1.CONFLIG_CODE,
                message: `The role's name must be unique`,
            };
        try {
            const newRole = await this.prismaService.role.update({
                where: {
                    roleID: id,
                },
                data: {
                    nameRole: updateRoleDto.nameRole,
                },
            });
            return {
                statusCode: code_1.OK_CODE,
                message: `update role have id = ${id} successfull`,
                data: newRole,
            };
        }
        catch (err) {
            console.error('Error updating role:', err);
        }
        return {
            statusCode: code_1.BADREQUEST_CODE,
            message: 'Another error!!!',
        };
    }
    async remove(id) {
        try {
            const usersInRole = await this.prismaService.user.count({
                where: { roleId: id },
            });
            if (usersInRole > 0) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Cannot delete role: There are users assigned to this role',
                };
            }
            await this.prismaService.role.delete({
                where: { roleID: id },
            });
            return {
                statusCode: code_1.OK_CODE,
                message: `Delete role with id = ${id} successfully`,
            };
        }
        catch (error) {
            const code = getPrismaErrorCode(error);
            if (code === 'P2025') {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Role ID does not exist',
                };
            }
            throw error;
        }
    }
    async getRoleByRoleName(nameRole) {
        const role = await this.prismaService.role.findUnique({
            where: {
                nameRole,
            },
        });
        if (!role)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: `The nameRole = ${nameRole} is not found`,
            };
        return {
            statusCode: code_1.OK_CODE,
            message: `get role successfull`,
            data: role,
        };
    }
    async isAdmin(roleID) {
        const { statusCode, message, data } = await this.findOne(roleID);
        if (statusCode !== code_1.OK_CODE)
            return {
                statusCode,
                message,
            };
        if (data !== undefined) {
            if (data.nameRole.toLocaleLowerCase() !== 'admin')
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'This role is not admin role',
                };
            return {
                statusCode: code_1.OK_CODE,
                message: 'This role is admin role',
            };
        }
        return {
            statusCode: code_1.BADREQUEST_CODE,
            message: 'Another error!!!',
        };
    }
    async isManager(roleID) {
        const { statusCode, message, data } = await this.findOne(roleID);
        if (statusCode !== code_1.OK_CODE)
            return {
                statusCode,
                message,
            };
        if (data !== undefined) {
            if (data.nameRole.toLocaleLowerCase() !== 'manager')
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'This role is not manager role',
                };
            return {
                statusCode: code_1.OK_CODE,
                message: 'This role is manager role',
            };
        }
        return {
            statusCode: code_1.BADREQUEST_CODE,
            message: 'Another error!!!',
        };
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoleService);
function getPrismaErrorCode(error) {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return undefined;
    }
    const code = error.code;
    return typeof code === 'string' ? code : undefined;
}
//# sourceMappingURL=role.service.js.map