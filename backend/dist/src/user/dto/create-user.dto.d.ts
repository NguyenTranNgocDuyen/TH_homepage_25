export declare class CreateUserDto {
    username: string;
    email: string;
    password?: string;
    roleID?: string;
    departmentID?: string;
    roleName?: string;
    departmentName?: string;
    linkAvatar?: string;
    phone?: string;
    address?: string;
    emergencyContact?: string;
    salaryCoefficient?: number;
    birthday?: Date;
    remainDaysofLeave?: number;
    totalDaysofLeave?: number;
    isActive?: boolean;
    refreshToken?: string;
}
