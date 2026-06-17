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
exports.DefaultResponse = exports.AnotherError = void 0;
const class_validator_1 = require("class-validator");
class ResponseDto {
    statusCode;
    message;
    data;
    constructor(partial) {
        if (!partial.statusCode || !partial.message) {
            throw new Error('Missing required fields');
        }
        Object.assign(this, partial);
    }
}
exports.default = ResponseDto;
class AnotherError {
    statusCode = 400;
    message = 'aonther code ';
    data;
}
exports.AnotherError = AnotherError;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AnotherError.prototype, "statusCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnotherError.prototype, "message", void 0);
class DefaultResponse {
    statusCode;
    message;
    data;
}
exports.DefaultResponse = DefaultResponse;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DefaultResponse.prototype, "statusCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DefaultResponse.prototype, "message", void 0);
//# sourceMappingURL=response.dto.js.map