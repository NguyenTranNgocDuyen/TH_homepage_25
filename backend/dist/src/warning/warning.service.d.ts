import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { CreateWarningDto } from './dto/create-warning.dto';
import ResponseDto from "../common/response.dto";
import WarningDto from './dto/warning.dto';
import { NotificationService } from "../notification/notification.service";
export declare class WarningService {
    private readonly userService;
    private readonly prismaService;
    private readonly notificationService;
    constructor(userService: UserService, prismaService: PrismaService, notificationService: NotificationService);
    sendWarning(createWarningDto: CreateWarningDto): Promise<ResponseDto<WarningDto>>;
}
