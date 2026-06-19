import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LeaveStatus, NotificationRelatedType } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const SERVER_TZ = process.env.TZ || 'UTC';

@Injectable()
export class ExpiredLeaveApplicationService implements OnModuleInit {
  private readonly logger = new Logger(ExpiredLeaveApplicationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.cancelOverduePendingLeaves(this.endOfYesterday(), 'startup');
  }

  @Cron('59 59 23 * * *')
  async cancelPendingLeavesAtEndOfDay(): Promise<void> {
    await this.cancelOverduePendingLeaves(this.endOfToday(), 'daily-cron');
  }

  async cancelOverduePendingLeaves(
    cutoff: Date,
    source = 'manual',
  ): Promise<number> {
    const expiredApplications = await this.prisma.leaveApplication.findMany({
      where: {
        status: LeaveStatus.PENDING,
        endDate: {
          lte: cutoff,
        },
      },
    });

    if (expiredApplications.length === 0) {
      this.logger.log(
        `[${source}] No overdue pending leave applications before ${cutoff.toISOString()}.`,
      );
      return 0;
    }

    const reason =
      'Tự động hủy do đơn nghỉ phép đã hết ngày nghỉ nhưng vẫn chưa được duyệt.';

    await this.prisma.$transaction(
      async (tx) => {
        for (const application of expiredApplications) {
          await tx.leaveApplication.update({
            where: { leaveApplicationID: application.leaveApplicationID },
            data: {
              status: LeaveStatus.CANCELLED,
              reasonReject: reason,
              reviewedAt: new Date(),
            },
          });

          await this.notificationService.createNotification(
            'system',
            application.senderID,
            `Đơn nghỉ phép từ ${this.formatDateKey(application.startDate)} đến ${this.formatDateKey(application.endDate)} đã tự động hủy vì quá hạn duyệt.`,
            NotificationRelatedType.LEAVE,
            tx,
          );
        }
      },
      { timeout: 30000 },
    );

    this.logger.log(
      `[${source}] Cancelled ${expiredApplications.length} overdue pending leave applications.`,
    );
    return expiredApplications.length;
  }

  private endOfToday(): Date {
    const d = dayjs().tz(SERVER_TZ).endOf('day');
    return d.toDate();
  }

  private endOfYesterday(): Date {
    const d = dayjs().tz(SERVER_TZ).subtract(1, 'day').endOf('day');
    return d.toDate();
  }

  private formatDateKey(date: Date): string {
    return dayjs(date).tz(SERVER_TZ).format('YYYY-MM-DD');
  }
}
