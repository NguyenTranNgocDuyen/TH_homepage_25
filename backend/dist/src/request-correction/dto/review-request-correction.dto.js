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
exports.ReviewRequestCorrectionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class ReviewRequestCorrectionDto {
    status;
    reasonReject;
}
exports.ReviewRequestCorrectionDto = ReviewRequestCorrectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Review status',
        enum: [client_1.TimesheetStatus.APPROVED, client_1.TimesheetStatus.REJECTED],
    }),
    (0, class_validator_1.IsEnum)(client_1.TimesheetStatus),
    __metadata("design:type", String)
], ReviewRequestCorrectionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for rejection', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReviewRequestCorrectionDto.prototype, "reasonReject", void 0);
//# sourceMappingURL=review-request-correction.dto.js.map