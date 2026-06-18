"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interval_Server_Network_Exeception_Code = exports.UNAUTHORIZED_CODE = exports.ANOTHER_ERROR_RESPONE = exports.BADREQUEST_CODE = exports.CREATED_RESPONE = exports.CONFLIG_CODE = exports.OK_CODE = exports.NOTFOUND_CODE = exports.nameTypeLeave_LeaveWithoutPermission = exports.nameTypeLeave_LeaveWithPermission = exports.nameTypeLeave_AnnualLeave = exports.nameRole_noneRole = exports.nameRole_emloyee = exports.nameRole_manager = exports.nameRole_admin = exports.PENDING = exports.REJECTED = exports.ACCEPTED = exports.APPROVED = exports.SUBMITTED = exports.DRAFT = void 0;
const NOTFOUND_CODE = 404;
exports.NOTFOUND_CODE = NOTFOUND_CODE;
const OK_CODE = 200;
exports.OK_CODE = OK_CODE;
const CONFLIG_CODE = 409;
exports.CONFLIG_CODE = CONFLIG_CODE;
const CREATED_RESPONE = 201;
exports.CREATED_RESPONE = CREATED_RESPONE;
const BADREQUEST_CODE = 400;
exports.BADREQUEST_CODE = BADREQUEST_CODE;
const UNAUTHORIZED_CODE = 403;
exports.UNAUTHORIZED_CODE = UNAUTHORIZED_CODE;
const Interval_Server_Network_Exeception_Code = 500;
exports.Interval_Server_Network_Exeception_Code = Interval_Server_Network_Exeception_Code;
const ANOTHER_ERROR_RESPONE = {
    statusCode: BADREQUEST_CODE,
    message: 'another ',
};
exports.ANOTHER_ERROR_RESPONE = ANOTHER_ERROR_RESPONE;
exports.DRAFT = 'DRAFT';
exports.SUBMITTED = 'SUBMITTED';
exports.APPROVED = 'APPROVED';
exports.ACCEPTED = exports.APPROVED;
exports.REJECTED = 'REJECTED';
exports.PENDING = 'PENDING';
exports.nameRole_admin = 'admin';
exports.nameRole_manager = 'manager';
exports.nameRole_emloyee = 'employee';
exports.nameRole_noneRole = 'none Role';
exports.nameTypeLeave_AnnualLeave = 'Annual Leave';
exports.nameTypeLeave_LeaveWithPermission = 'Leave with permission';
exports.nameTypeLeave_LeaveWithoutPermission = 'Leave with permission';
//# sourceMappingURL=code.js.map