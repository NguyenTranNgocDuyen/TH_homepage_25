import axiosClient from '../api/axiosClient';

export async function getTimesheets() {
  const response = await axiosClient.get('/timesheetentries');
  return response.data;
}

export async function getTimesheetById(id) {
  const response = await axiosClient.get(`/timesheetentries/${id}`);
  return response.data;
}

export async function createTimesheet(data) {
  const response = await axiosClient.post('/timesheetentries', data);
  return response.data;
}

export async function updateTimesheet(id, data) {
  const response = await axiosClient.put(`/timesheetentries/${id}`, data);
  return response.data;
}

export async function deleteTimesheet(id) {
  const response = await axiosClient.delete(`/timesheetentries/${id}`);
  return response.data;
}
