import { Prisma, NotificationRelatedType } from '@prisma/client';
import ResponseDto from "../common/response.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { CreateNotificationDto } from './dto/create-notification.dto';
import NotificationDto from './dto/notification.dto';
import { RealtimeService } from "../realtime/realtime.service";
export declare class NotificationService {
    private readonly userService;
    private readonly prismaService;
    private readonly realtimeService;
    constructor(userService: UserService, prismaService: PrismaService, realtimeService: RealtimeService);
    sendNotification(senderID: string, createNotificationDto: CreateNotificationDto, tx?: Prisma.TransactionClient): Promise<ResponseDto<NotificationDto>>;
    getReceivedNotifications(userID: string): Promise<ResponseDto<NotificationDto[]>>;
    getSentNotifications(userID: string): Promise<ResponseDto<NotificationDto[]>>;
    markAsRead(notificationID: string, receiverID?: string): Promise<ResponseDto<NotificationDto>>;
    getUnreadCount(userID: string): Promise<ResponseDto<{
        count: number;
    }>>;
    createNotification(senderID: string | null, receiverID: string, content: string, relatedType?: NotificationRelatedType, tx?: Prisma.TransactionClient): Promise<ResponseDto<NotificationDto>>;
}
