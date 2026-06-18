export default class FullUserDto {
    userID: string;
    email: string;
    username: string;
    hashedPassword: string;
    linkAvatar?: string | null;
    phone?: string | null;
    address?: string | null;
    emergencyContact?: string | null;
    salaryCoefficient?: number;
    birthday?: Date | null;
    remainDaysofLeave?: number;
    totalDaysofLeave?: number;
    isActive?: boolean | null;
    roleId: string | null;
    departmentID?: string | null;
    acessToken?: string;
    refreshToken?: string | null;
    role?: {
        roleID: string;
        nameRole: string;
    };
    department?: {
        departmentID: string;
        departmentName: string;
        managerID: string | null;
        manager?: {
            username: string;
            email: string;
        } | null;
    } | null;
}
