export default class WarningDto {
    warningID: string;
    userID: string;
    content: string | null;
    createdAt: Date;
    level?: string | null;
}
