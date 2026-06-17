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
exports.TypeLeaveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const code_1 = require("../common/code");
let TypeLeaveService = class TypeLeaveService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        if (process.env.ENABLE_TYPE_LEAVE_LEGACY_SEED !== 'true') {
            return;
        }
        try {
            const count = await this.prisma.typeLeave.count();
            if (count === 0) {
                console.log('Seeding default TypeLeave data...');
                await this.prisma.typeLeave.createMany({
                    data: [
                        { code: 'AL', nameTypeLeave: 'Nghỉ phép năm', hasSalary: 1 },
                        { code: 'UP', nameTypeLeave: 'Nghỉ không lương', hasSalary: 0 },
                        { code: 'SL', nameTypeLeave: 'Nghỉ ốm', hasSalary: 1 },
                        { code: 'ML', nameTypeLeave: 'Nghỉ cưới', hasSalary: 1 },
                    ],
                });
                console.log('Seeding default TypeLeave data completed.');
            }
        }
        catch (error) {
            console.error('Error seeding TypeLeave data:', error);
        }
    }
    async getAllTypeLeaves(includeInactive = false) {
        try {
            const typeLeaves = await this.prisma.typeLeave.findMany({
                where: includeInactive ? undefined : { isActive: true },
                orderBy: [{ isActive: 'desc' }, { nameTypeLeave: 'asc' }],
            });
            return {
                statusCode: code_1.OK_CODE,
                message: 'Lấy danh sách loại nghỉ phép thành công',
                data: typeLeaves,
            };
        }
        catch {
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Lỗi server',
            };
        }
    }
    async getTypeLeave(typeLeaveID) {
        try {
            const typeLeave = await this.prisma.typeLeave.findUnique({
                where: { typeLeaveID },
            });
            if (!typeLeave) {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Không tìm thấy loại nghỉ phép',
                };
            }
            return {
                statusCode: code_1.OK_CODE,
                message: 'Lấy chi tiết loại nghỉ phép thành công',
                data: typeLeave,
            };
        }
        catch {
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Lỗi server',
            };
        }
    }
    async createTypeLeave(createDto) {
        try {
            const code = createDto.code.trim().toUpperCase();
            const existingCode = await this.prisma.typeLeave.findUnique({
                where: { code },
            });
            if (existingCode) {
                return {
                    statusCode: code_1.CONFLIG_CODE,
                    message: 'Mã loại nghỉ đã tồn tại',
                };
            }
            const newTypeLeave = await this.prisma.typeLeave.create({
                data: {
                    ...createDto,
                    code,
                    isActive: createDto.isActive ?? true,
                },
            });
            return {
                statusCode: code_1.CREATED_RESPONE,
                message: 'Tạo loại nghỉ phép thành công',
                data: newTypeLeave,
            };
        }
        catch (error) {
            console.error('Error creating type leave:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Lỗi server',
            };
        }
    }
    async updateTypeLeave(typeLeaveID, updateDto) {
        try {
            const typeLeave = await this.prisma.typeLeave.findUnique({
                where: { typeLeaveID },
            });
            if (!typeLeave) {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Không tìm thấy loại nghỉ phép',
                };
            }
            const code = updateDto.code?.trim().toUpperCase();
            if (code) {
                const existingCode = await this.prisma.typeLeave.findUnique({
                    where: { code },
                });
                if (existingCode && existingCode.typeLeaveID !== typeLeaveID) {
                    return {
                        statusCode: code_1.CONFLIG_CODE,
                        message: 'Mã loại nghỉ đã tồn tại',
                    };
                }
            }
            const updatedTypeLeave = await this.prisma.typeLeave.update({
                where: { typeLeaveID },
                data: {
                    ...updateDto,
                    code,
                },
            });
            return {
                statusCode: code_1.OK_CODE,
                message: 'Cập nhật loại nghỉ phép thành công',
                data: updatedTypeLeave,
            };
        }
        catch {
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Lỗi server',
            };
        }
    }
    async deleteTypeLeave(typeLeaveID) {
        try {
            const typeLeave = await this.prisma.typeLeave.findUnique({
                where: { typeLeaveID },
            });
            if (!typeLeave) {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Không tìm thấy loại nghỉ phép',
                };
            }
            const updatedTypeLeave = await this.prisma.typeLeave.update({
                where: { typeLeaveID },
                data: { isActive: false },
            });
            return {
                statusCode: code_1.OK_CODE,
                message: 'Vô hiệu hóa loại nghỉ phép thành công',
                data: updatedTypeLeave,
            };
        }
        catch {
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Lỗi server',
            };
        }
    }
    async setTypeLeaveActive(typeLeaveID, isActive) {
        try {
            const typeLeave = await this.prisma.typeLeave.findUnique({
                where: { typeLeaveID },
            });
            if (!typeLeave) {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Không tìm thấy loại nghỉ phép',
                };
            }
            const updatedTypeLeave = await this.prisma.typeLeave.update({
                where: { typeLeaveID },
                data: { isActive },
            });
            return {
                statusCode: code_1.OK_CODE,
                message: isActive
                    ? 'Kích hoạt loại nghỉ phép thành công'
                    : 'Vô hiệu hóa loại nghỉ phép thành công',
                data: updatedTypeLeave,
            };
        }
        catch {
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Lỗi server',
            };
        }
    }
};
exports.TypeLeaveService = TypeLeaveService;
exports.TypeLeaveService = TypeLeaveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TypeLeaveService);
//# sourceMappingURL=type-leave.service.js.map