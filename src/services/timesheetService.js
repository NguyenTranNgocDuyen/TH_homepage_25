import axiosClient from '../api/axiosClient';

export async function getTimesheets() {
  const response = await axiosClient.get('/Timesheets');
  return response.data;
}

export async function getTimesheetById(id) {
  const response = await axiosClient.get(`/Timesheets/${id}`);
  return response.data;
}

export async function createTimesheet(data) {
  const response = await axiosClient.post('/Timesheets', data);
  return response.data;
}

export async function updateTimesheet(id, data) {
  const response = await axiosClient.put(`/Timesheets/${id}`, data);
  return response.data;
}

export async function deleteTimesheet(id) {
  const response = await axiosClient.delete(`/Timesheets/${id}`);
  return response.data;
}
