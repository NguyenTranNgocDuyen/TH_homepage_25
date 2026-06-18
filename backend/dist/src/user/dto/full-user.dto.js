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
let FullUserDto = class FullUserDto {
    userID;
    email;
    username;
    hashedPassword;
    linkAvatar;
    phone;
    address;
    emergencyContact;
    salaryCoefficient;
    birthday;
    remainDaysofLeave;
    totalDaysofLeave;
    isActive;
    roleId;
    departmentID;
    acessToken;
    refreshToken;
    role;
    department;
};
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FullUserDto.prototype, "userID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'email',
        example: 'abc@gmail.com',
        required: true,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], FullUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'username',
        example: 'hahaha',
        required: true,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FullUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'password',
        example: 'hacked by me',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FullUserDto.prototype, "hashedPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'linkAvatar',
        example: '',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FullUserDto.prototype, "linkAvatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'phone',
        example: '0900000000',
        required: false,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FullUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'address',
        example: 'Ha Noi',
        required: false,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FullUserDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'emergencyContact',
        example: '0900000001',
        required: false,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FullUserDto.prototype, "emergencyContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'salaryCoefficient',
        example: '0.01',
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FullUserDto.prototype, "salaryCoefficient", void 0);
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
], FullUserDto.prototype, "birthday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'remainDaysofLeaves',
        example: '12',
        required: false,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FullUserDto.prototype, "remainDaysofLeave", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'totalDayOfLeaves',
        example: '12',
        required: false,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FullUserDto.prototype, "totalDaysofLeave", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'isActive',
        example: 'true',
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FullUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'roleName',
        example: 'admin',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FullUserDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'departmentName',
        example: 'IT',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FullUserDto.prototype, "departmentID", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FullUserDto.prototype, "acessToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FullUserDto.prototype, "refreshToken", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FullUserDto.prototype, "role", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FullUserDto.prototype, "department", void 0);
FullUserDto = __decorate([
    (0, class_transformer_1.Exclude)()
], FullUserDto);
exports.default = FullUserDto;
//# sourceMappingURL=full-user.dto.js.map