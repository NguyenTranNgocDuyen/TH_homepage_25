import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentWeekRange } from '../../utils/dateUtils';
import { saveAuthSession } from '../../utils/storage';
import httpClient from '../../utils/httpClient';
import { getMonthlyTimesheetPeriodData } from '../timesheetService';

vi.mock('../../utils/httpClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockedHttpClient = vi.mocked(httpClient);

function createSession() {
  saveAuthSession({
    token: 'token',
    accessToken: 'token',
    refreshToken: 'refresh',
    id: 'user-1',
    userID: 'user-1',
    email: 'employee@example.com',
    name: 'Employee',
    role: 'employee',
    departmentId: 'dept-1',
    managedEmployeeIds: [],
    permissions: [],
    isActive: true,
    provider: 'local',
    loggedInAt: '2026-06-19T00:00:00.000Z',
  });
}

describe('timesheet week range view', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    createSession();

    mockedHttpClient.get.mockImplementation((url: string, config?: any) => {
      if (url.startsWith('/time-sheet/monthlyTimesheet/')) {
        const month = Number(config?.params?.month);
        const year = Number(config?.params?.year);
        return Promise.resolve({
          data: {
            monthlyTimesheetID: `monthly-${String(month).padStart(2, '0')}`,
            userID: 'user-1',
            month,
            year,
            status: 'Draft',
            canSubmit: false,
            isSubmitted: false,
          },
        });
      }

      if (url.startsWith('/attendance-module/getAllAttendenceOfMonth/')) {
        const month = Number(config?.params?.month);
        const rowsByMonth: Record<number, any[]> = {
          6: [
            {
              timesheetEntryID: 'entry-2026-06-16',
              monthlyTimesheetID: 'monthly-06',
              date: '2026-06-16',
              checkIn: '2026-06-16T08:00:00.000Z',
              checkOut: '2026-06-16T17:30:00.000Z',
            },
          ],
          7: [
            {
              timesheetEntryID: 'entry-2026-06-19',
              monthlyTimesheetID: 'monthly-07',
              date: '2026-06-19',
              checkIn: '2026-06-19T08:00:00.000Z',
              checkOut: '2026-06-19T17:30:00.000Z',
            },
          ],
        };

        return Promise.resolve({ data: rowsByMonth[month] || [] });
      }

      if (url.startsWith('/request-correction/my/')) {
        return Promise.resolve({ data: [] });
      }

      return Promise.resolve({ data: [] });
    });
  });

  it('uses the calendar week for anchorDate=2026-06-19', () => {
    const range = getCurrentWeekRange(new Date('2026-06-19T00:00:00'));

    expect(range.startKey).toBe('2026-06-15');
    expect(range.endKey).toBe('2026-06-21');
  });

  it('loads rows from both monthly timesheets when the week crosses the 17-16 boundary', async () => {
    const data = await getMonthlyTimesheetPeriodData({
      userID: 'user-1',
      userEmail: 'employee@example.com',
      month: 7,
      year: 2026,
      periodType: 'week',
      anchorDate: new Date('2026-06-19T00:00:00'),
    });

    expect(data.period.startKey).toBe('2026-06-15');
    expect(data.period.endKey).toBe('2026-06-21');
    expect(data.rows.map((row) => row.date).sort()).toEqual(['2026-06-16', '2026-06-19']);
    expect(data.rows.find((row) => row.date === '2026-06-16')?.monthlyTimesheetID).toBe('monthly-06');
    expect(data.rows.find((row) => row.date === '2026-06-19')?.monthlyTimesheetID).toBe('monthly-07');
  });
});
