import ResponseDto from "../common/response.dto";
import { CreateNotificationDto } from './dto/create-notification.dto';
import NotificationDto from './dto/notification.dto';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(userID: string, createNotificationDto: CreateNotificationDto, currentUserID: string): Promise<ResponseDto<NotificationDto>>;
    getAllMyReceviedNotifications(userID: string, currentUserID: string): Promise<ResponseDto<NotificationDto[]>>;
    getAllMySendNotifications(userID: string, currentUserID: string): Promise<ResponseDto<NotificationDto[]>>;
    markAsRead(notificationID: string, currentUserID: string): Promise<ResponseDto<NotificationDto>>;
    getUnreadCount(userID: string, currentUserID: string): Promise<ResponseDto<{
        count: number;
    }>>;
    private assertMe;
    private throwFromResponse;
}
