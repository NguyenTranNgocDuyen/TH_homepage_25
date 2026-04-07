const AUTH_STORAGE_KEY = 'timesheet_pro_auth';

function parseStoredValue(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function getAuthSession() {
  const localValue = parseStoredValue(localStorage.getItem(AUTH_STORAGE_KEY));

  if (localValue?.token) {
    return localValue;
  }

  const sessionValue = parseStoredValue(sessionStorage.getItem(AUTH_STORAGE_KEY));

  if (sessionValue?.token) {
    return sessionValue;
  }

  return null;
}

export function saveAuthSession(session, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  otherStorage.removeItem(AUTH_STORAGE_KEY);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getDashboardPathByRole(role) {
  switch (role) {
    case 'employee':
      return '/dashboard/employee';
    case 'manager':
      return '/dashboard/manager';
    case 'hr':
      return '/dashboard/hr';
    default:
      return '/unauthorized';
  }
}
