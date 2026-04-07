import { createMockAttendanceSeed } from '../data/mockAttendance';
import { getCurrentDeviceInfo as readCurrentDeviceInfo } from '../utils/deviceInfo';
import {
  calculateWorkingHours as calculateWorkingHoursValue,
  formatTimeFromIso,
  getTodayDateKey,
} from '../utils/timeUtils';

const ATTENDANCE_STORAGE_KEY = 'timesheet_pro_attendance_records';
const ATTENDANCE_IP_KEY = 'timesheet_pro_mock_ip';
const DEFAULT_IP = '192.168.1.20';
const ALTERNATE_IP = '10.0.0.15';

function parseStoredRecords() {
  const storedValue = localStorage.getItem(ATTENDANCE_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeRecords(nextRecords) {
  const previousRaw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);

  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(nextRecords));
  } catch (error) {
    if (previousRaw) {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, previousRaw);
    }

    const saveError = new Error('Attendance save failed');
    saveError.code = 'ATTENDANCE_SAVE_FAILED';
    throw saveError;
  }
}

function ensureSeedRecords() {
  const parsedRecords = parseStoredRecords();

  if (parsedRecords) {
    return parsedRecords;
  }

  const seedRecords = createMockAttendanceSeed();
  writeRecords(seedRecords);
  return seedRecords;
}

function getAllRecords() {
  return ensureSeedRecords();
}

function createAttendanceId(userEmail, dateKey) {
  return `attendance-${userEmail}-${dateKey}`;
}

function createUnauthorizedError() {
  const error = new Error('Attendance is only available for employee role');
  error.code = 'ATTENDANCE_UNAUTHORIZED';
  return error;
}

function ensureEmployeeUser(user) {
  if (!user?.email || user?.role !== 'employee') {
    throw createUnauthorizedError();
  }
}

export function getCurrentMockIp() {
  return localStorage.getItem(ATTENDANCE_IP_KEY) || DEFAULT_IP;
}

export function toggleMockIp() {
  const nextIp = getCurrentMockIp() === DEFAULT_IP ? ALTERNATE_IP : DEFAULT_IP;
  localStorage.setItem(ATTENDANCE_IP_KEY, nextIp);
  return nextIp;
}

export function getCurrentDeviceInfo() {
  return getCurrentDeviceInfoFromBrowser();
}

function getCurrentDeviceInfoFromBrowser() {
  return readCurrentDeviceInfo();
}

export function calculateWorkingHoursForRecord(checkInIso, checkOutIso) {
  return calculateWorkingHoursValue(checkInIso, checkOutIso);
}

export { calculateWorkingHoursForRecord as calculateWorkingHours };

export function getUserAttendanceRecords(userEmail) {
  return getAllRecords()
    .filter((record) => record.userEmail === userEmail)
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function markMissingCheckoutRecords(userEmail) {
  const records = getAllRecords();
  const todayKey = getTodayDateKey();
  let updatedCount = 0;

  const nextRecords = records.map((record) => {
    const shouldMarkMissing =
      record.userEmail === userEmail &&
      record.date < todayKey &&
      record.checkInTime &&
      !record.checkOutTime &&
      record.status !== 'Missing Out';

    if (!shouldMarkMissing) {
      return record;
    }

    updatedCount += 1;

    return {
      ...record,
      status: 'Missing Out',
      note: 'Ban da quen check-out. Vui long giai trinh.',
    };
  });

  if (updatedCount > 0) {
    writeRecords(nextRecords);
  }

  return {
    updatedCount,
    records: nextRecords
      .filter((record) => record.userEmail === userEmail)
      .sort((left, right) => right.date.localeCompare(left.date)),
  };
}

export function getTodayAttendance(userEmail) {
  const todayKey = getTodayDateKey();

  return getAllRecords().find(
    (record) => record.userEmail === userEmail && record.date === todayKey,
  ) || null;
}

export function getAttendanceHistory(userEmail, limit = 7) {
  return getUserAttendanceRecords(userEmail).slice(0, limit);
}

export async function checkIn(user) {
  ensureEmployeeUser(user);

  await new Promise((resolve) => {
    window.setTimeout(resolve, 700);
  });

  const records = getAllRecords();
  const todayKey = getTodayDateKey();
  const existingRecord = records.find(
    (record) => record.userEmail === user.email && record.date === todayKey,
  );

  if (existingRecord?.status === 'Working' || (existingRecord?.checkInTime && !existingRecord?.checkOutTime)) {
    const error = new Error('Already checked in');
    error.code = 'ALREADY_CHECKED_IN';
    throw error;
  }

  if (existingRecord?.checkInTime && existingRecord?.checkOutTime) {
    const error = new Error('Attendance already completed');
    error.code = 'ALREADY_COMPLETED';
    throw error;
  }

  const serverTime = new Date().toISOString();
  const ipAddress = getCurrentMockIp();
  const deviceInfo = getCurrentDeviceInfoFromBrowser();

  const nextRecord = {
    id: createAttendanceId(user.email, todayKey),
    userEmail: user.email,
    date: todayKey,
    checkInTime: formatTimeFromIso(serverTime),
    checkOutTime: null,
    totalHours: null,
    status: 'Working',
    serverTimeAtCheckIn: serverTime,
    serverTimeAtCheckOut: null,
    ipAddressAtCheckIn: ipAddress,
    ipAddressAtCheckOut: null,
    deviceInfoAtCheckIn: deviceInfo,
    deviceInfoAtCheckOut: null,
    hasIpWarning: false,
    note: '',
  };

  const filteredRecords = records.filter(
    (record) => !(record.userEmail === user.email && record.date === todayKey),
  );

  writeRecords([...filteredRecords, nextRecord]);
  return nextRecord;
}

export async function checkOut(user) {
  ensureEmployeeUser(user);

  await new Promise((resolve) => {
    window.setTimeout(resolve, 700);
  });

  const records = getAllRecords();
  const todayKey = getTodayDateKey();
  const currentRecord = records.find(
    (record) => record.userEmail === user.email && record.date === todayKey,
  );

  if (!currentRecord?.checkInTime) {
    const error = new Error('Not checked in yet');
    error.code = 'NOT_CHECKED_IN';
    throw error;
  }

  if (currentRecord.checkOutTime) {
    const error = new Error('Attendance already completed');
    error.code = 'ALREADY_COMPLETED';
    throw error;
  }

  const serverTime = new Date().toISOString();
  const ipAddress = getCurrentMockIp();
  const deviceInfo = getCurrentDeviceInfoFromBrowser();
  const hasIpWarning =
    Boolean(currentRecord.ipAddressAtCheckIn) &&
    currentRecord.ipAddressAtCheckIn !== ipAddress;

  const normalizedTotalHours = calculateWorkingHoursValue(
    currentRecord.serverTimeAtCheckIn,
    serverTime,
  );

  const note = hasIpWarning
    ? 'IP thay doi bat thuong, quan ly se xem xet.'
    : currentRecord.note || '';

  const updatedRecord = {
    ...currentRecord,
    checkOutTime: formatTimeFromIso(serverTime),
    totalHours: normalizedTotalHours,
    status: 'Completed',
    serverTimeAtCheckOut: serverTime,
    ipAddressAtCheckOut: ipAddress,
    deviceInfoAtCheckOut: deviceInfo,
    hasIpWarning,
    note,
  };

  const nextRecords = records.map((record) =>
    record.id === updatedRecord.id ? updatedRecord : record,
  );

  writeRecords(nextRecords);
  return updatedRecord;
}
