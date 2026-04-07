import { mockCorrections } from '../data/mockCorrections';

const CORRECTION_STORAGE_KEY = 'timesheet_pro_corrections';

function parseStoredCorrections() {
  const rawValue = localStorage.getItem(CORRECTION_STORAGE_KEY);

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

function ensureCorrections() {
  const parsed = parseStoredCorrections();

  if (parsed) {
    return parsed;
  }

  localStorage.setItem(CORRECTION_STORAGE_KEY, JSON.stringify(mockCorrections));
  return [...mockCorrections];
}

function writeCorrections(nextCorrections) {
  localStorage.setItem(CORRECTION_STORAGE_KEY, JSON.stringify(nextCorrections));
}

export function getCorrectionsByUser(userEmail) {
  return ensureCorrections()
    .filter((item) => item.userEmail === userEmail)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

export function getCorrectionByAttendanceId(attendanceId) {
  return ensureCorrections().find((item) => item.attendanceId === attendanceId) || null;
}

export function hasPendingCorrections(userEmail, attendanceIds = []) {
  return ensureCorrections().some(
    (item) =>
      item.userEmail === userEmail &&
      attendanceIds.includes(item.attendanceId) &&
      item.status === 'Pending',
  );
}

export function createCorrectionRequest(payload) {
  const corrections = ensureCorrections();

  const duplicatePending = corrections.find(
    (item) =>
      item.userEmail === payload.userEmail &&
      item.attendanceId === payload.attendanceId &&
      item.status === 'Pending',
  );

  if (duplicatePending) {
    const error = new Error('Pending correction already exists');
    error.code = 'CORRECTION_PENDING_EXISTS';
    throw error;
  }

  const nextCorrection = {
    id: `correction-${payload.userEmail}-${payload.date}-${Date.now()}`,
    userEmail: payload.userEmail,
    attendanceId: payload.attendanceId,
    date: payload.date,
    requestedCheckIn: payload.requestedCheckIn || null,
    requestedCheckOut: payload.requestedCheckOut || null,
    reason: payload.reason,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  writeCorrections([...corrections, nextCorrection]);
  return nextCorrection;
}
