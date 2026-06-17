export default class NotificationDto {
    notificationID: string;
    senderID?: string | null;
    receiverID: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    relatedType?: string | null;
}
