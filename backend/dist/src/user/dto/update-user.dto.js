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
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class updateUserDto {
    username;
    email;
    password;
    linkAvatar;
    phone;
    address;
    emergencyContact;
    salaryCoefficient;
    birthday;
    remainDaysofLeave;
    totalDaysofLeave;
    isActive;
    roleName;
    departmentName;
    refreshToken;
}
exports.default = updateUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'linkAvatar',
        example: '',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "linkAvatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'phone',
        example: '0900000000',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], updateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'address',
        example: 'Ha Noi',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], updateUserDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'emergencyContact',
        example: '0900000001',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], updateUserDto.prototype, "emergencyContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'salaryCoefficient',
        example: '0.01',
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], updateUserDto.prototype, "salaryCoefficient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'birthday',
        example: '04/10/2005',
        required: false,
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], updateUserDto.prototype, "birthday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'remainDaysofLeaves',
        example: '12',
        required: false,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], updateUserDto.prototype, "remainDaysofLeave", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'totalDayOfLeaves',
        example: '12',
        required: false,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], updateUserDto.prototype, "totalDaysofLeave", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'isActive',
        example: 'true',
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], updateUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'roleName',
        example: 'admin',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "roleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'departmentName',
        example: 'IT',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "departmentName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'departmentName',
        example: 'IT',
        required: false,
    }),
    __metadata("design:type", String)
], updateUserDto.prototype, "refreshToken", void 0);
//# sourceMappingURL=update-user.dto.js.map