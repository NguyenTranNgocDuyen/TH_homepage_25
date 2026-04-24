import axiosClient from '../api/axiosClient';

export async function getLeaveRequests() {
  const response = await axiosClient.get('/leaverequests');
  return response.data;
}

export async function getLeaveRequestById(id) {
  const response = await axiosClient.get(`/leaverequests/${id}`);
  return response.data;
}

export async function createLeaveRequest(data) {
  const response = await axiosClient.post('/leaverequests', data);
  return response.data;
}

export async function updateLeaveRequest(id, data) {
  const response = await axiosClient.put(`/leaverequests/${id}`, data);
  return response.data;
}

export async function deleteLeaveRequest(id) {
  const response = await axiosClient.delete(`/leaverequests/${id}`);
  return response.data;
}
