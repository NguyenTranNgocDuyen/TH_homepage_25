import axiosClient from '../api/axiosClient';

export async function getLeaveRequests() {
  const response = await axiosClient.get('/LeaveRequests');
  return response.data;
}

export async function getLeaveRequestById(id) {
  const response = await axiosClient.get(`/LeaveRequests/${id}`);
  return response.data;
}

export async function createLeaveRequest(data) {
  const response = await axiosClient.post('/LeaveRequests', data);
  return response.data;
}

export async function updateLeaveRequest(id, data) {
  const response = await axiosClient.put(`/LeaveRequests/${id}`, data);
  return response.data;
}

export async function deleteLeaveRequest(id) {
  const response = await axiosClient.delete(`/LeaveRequests/${id}`);
  return response.data;
}
