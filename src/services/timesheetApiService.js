const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'API request failed.');
  }

  return data;
}

export async function fetchEmployees() {
  const response = await fetch('/api/employees');
  return handleResponse(response);
}

export async function fetchTimesheets() {
  const response = await fetch('/api/timesheets');
  return handleResponse(response);
}

export async function createTimesheet(payload) {
  const response = await fetch('/api/timesheets', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

