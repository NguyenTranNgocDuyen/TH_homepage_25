export default class UserDto {
    userID: string;
    email: string;
    username: string;
    linkAvatar?: string | null;
    phone?: string | null;
    address?: string | null;
    emergencyContact?: string | null;
    departmentName?: string;
    departmentID?: string | null;
    roleId: string | null;
    role?: unknown;
}
