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
exports.CreateRequestCorrectionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRequestCorrectionDto {
    monthlyTimesheetID;
    timesheetEntryID;
    date;
    requestedCheckIn;
    requestedCheckOut;
    reason;
}
exports.CreateRequestCorrectionDto = CreateRequestCorrectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monthly timesheet ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRequestCorrectionDto.prototype, "monthlyTimesheetID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timesheet entry ID to correct',
        required: false,
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRequestCorrectionDto.prototype, "timesheetEntryID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Work date of the correction', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRequestCorrectionDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Proposed check-in time, HH:mm or ISO datetime',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRequestCorrectionDto.prototype, "requestedCheckIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Proposed check-out time, HH:mm or ISO datetime',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRequestCorrectionDto.prototype, "requestedCheckOut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for correction' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRequestCorrectionDto.prototype, "reason", void 0);
//# sourceMappingURL=create-request-correction.dto.js.map