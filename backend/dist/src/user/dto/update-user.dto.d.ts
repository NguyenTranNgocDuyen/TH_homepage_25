export default class updateUserDto {
    username?: string;
    email?: string;
    password?: string;
    linkAvatar?: string;
    phone?: string | null;
    address?: string | null;
    emergencyContact?: string | null;
    salaryCoefficient?: number;
    birthday?: Date | null;
    remainDaysofLeave?: number;
    totalDaysofLeave?: number;
    isActive?: boolean | null;
    roleName?: string;
    departmentName?: string;
    refreshToken?: string;
}
