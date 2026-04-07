import { mockLeavePolicy, mockLeaveRequests } from '../data/mockLeave';

const LEAVE_STORAGE_KEY = 'timesheet_pro_leave_requests';

function parseStoredLeaveRequests() {
  const rawValue = localStorage.getItem(LEAVE_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function ensureLeaveRequests() {
  const parsed = parseStoredLeaveRequests();

  if (parsed) {
    return parsed;
  }

  localStorage.setItem(LEAVE_STORAGE_KEY, JSON.stringify(mockLeaveRequests));
  return [...mockLeaveRequests];
}

function writeLeaveRequests(nextRequests) {
  localStorage.setItem(LEAVE_STORAGE_KEY, JSON.stringify(nextRequests));
}

export function calculateLeaveDays(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return 0;
  }

  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
}

export function getLeaveRequestsByUser(userEmail) {
  return ensureLeaveRequests()
    .filter((item) => item.userEmail === userEmail)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

export function getLeaveSummary(userEmail) {
  const requests = getLeaveRequestsByUser(userEmail);
  const approved = requests
    .filter((item) => item.status === 'Approved' && !item.isUnpaid)
    .reduce((total, item) => total + item.totalDays, 0);
  const pending = requests
    .filter((item) => item.status === 'Pending')
    .reduce((total, item) => total + item.totalDays, 0);

  return {
    totalAnnualDays: mockLeavePolicy.totalAnnualDays,
    usedDays: approved,
    pendingDays: pending,
    remainingDays: Math.max(mockLeavePolicy.totalAnnualDays - approved, 0),
  };
}

export function createLeaveRequest(payload) {
  const requests = ensureLeaveRequests();
  const nextRequest = {
    id: `leave-${payload.userEmail}-${Date.now()}`,
    userEmail: payload.userEmail,
    type: payload.type,
    startDate: payload.startDate,
    endDate: payload.endDate,
    totalDays: payload.totalDays,
    reason: payload.reason,
    status: 'Pending',
    isUnpaid: Boolean(payload.isUnpaid),
    createdAt: new Date().toISOString(),
  };

  const nextRequests = [nextRequest, ...requests];
  writeLeaveRequests(nextRequests);
  return nextRequest;
}

