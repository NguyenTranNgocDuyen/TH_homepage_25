import { useEffect, useState } from 'react';
import TimesheetForm from './TimesheetForm';
import TimesheetList from './TimesheetList';
import LeaveRequestForm from './LeaveRequestForm';
import LeaveRequestList from './LeaveRequestList';
import {
  createTimesheet,
  deleteTimesheet,
  getTimesheetById,
  getTimesheets,
  updateTimesheet,
} from '../services/timesheetService';
import {
  createLeaveRequest,
  deleteLeaveRequest,
  getLeaveRequestById,
  getLeaveRequests,
  updateLeaveRequest,
} from '../services/leaveRequestService';

const tabs = [
  { id: 'timesheet', label: 'Quản lý chấm công' },
  { id: 'leave', label: 'Quản lý nghỉ phép' },
];

function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (responseData?.errors) {
    const detailMessage = Object.values(responseData.errors).flat().join(' ');
    return detailMessage || fallbackMessage;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.title) {
    return responseData.title;
  }

  return error?.message || fallbackMessage;
}

function ManagementSection() {
  const [activeTab, setActiveTab] = useState('timesheet');
  const [timesheets, setTimesheets] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoadingTimesheets, setIsLoadingTimesheets] = useState(true);
  const [isLoadingLeaveRequests, setIsLoadingLeaveRequests] = useState(true);
  const [isSavingTimesheet, setIsSavingTimesheet] = useState(false);
  const [isSavingLeaveRequest, setIsSavingLeaveRequest] = useState(false);
  const [editingTimesheetId, setEditingTimesheetId] = useState(null);
  const [editingLeaveRequestId, setEditingLeaveRequestId] = useState(null);
  const [deletingTimesheetId, setDeletingTimesheetId] = useState(null);
  const [deletingLeaveRequestId, setDeletingLeaveRequestId] = useState(null);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [editingLeaveRequest, setEditingLeaveRequest] = useState(null);
  const [feedback, setFeedback] = useState({
    type: 'success',
    text: 'Kết nối CRUD demo với Axios và ASP.NET Core Web API.',
  });

  useEffect(() => {
    loadTimesheets();
    loadLeaveRequests();
  }, []);

  async function loadTimesheets() {
    try {
      setIsLoadingTimesheets(true);
      const data = await getTimesheets();
      setTimesheets(data);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getApiErrorMessage(error, 'Không tải được danh sách chấm công.'),
      });
    } finally {
      setIsLoadingTimesheets(false);
    }
  }

  async function loadLeaveRequests() {
    try {
      setIsLoadingLeaveRequests(true);
      const data = await getLeaveRequests();
      setLeaveRequests(data);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getApiErrorMessage(error, 'Không tải được danh sách nghỉ phép.'),
      });
    } finally {
      setIsLoadingLeaveRequests(false);
    }
  }

  async function handleTimesheetSubmit(payload) {
    try {
      setIsSavingTimesheet(true);

      if (editingTimesheet?.id) {
        await updateTimesheet(editingTimesheet.id, payload);
        setFeedback({ type: 'success', text: 'Cập nhật bản ghi chấm công thành công.' });
      } else {
        await createTimesheet(payload);
        setFeedback({ type: 'success', text: 'Thêm mới bản ghi chấm công thành công.' });
      }

      setEditingTimesheet(null);
      await loadTimesheets();
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getApiErrorMessage(error, 'Không thể lưu bản ghi chấm công.'),
      });
      throw error;
    } finally {
      setIsSavingTimesheet(false);
    }
  }

  async function handleLeaveRequestSubmit(payload) {
    try {
      setIsSavingLeaveRequest(true);

      if (editingLeaveRequest?.id) {
        await updateLeaveRequest(editingLeaveRequest.id, payload);
        setFeedback({ type: 'success', text: 'Cập nhật đơn nghỉ phép thành công.' });
      } else {
        await createLeaveRequest(payload);
        setFeedback({ type: 'success', text: 'Tạo đơn nghỉ phép thành công.' });
      }

      setEditingLeaveRequest(null);
      await loadLeaveRequests();
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getApiErrorMessage(error, 'Không thể lưu đơn nghỉ phép.'),
      });
      throw error;
    } finally {
      setIsSavingLeaveRequest(false);
    }
  }

  async function handleEditTimesheet(id) {
    try {
      setEditingTimesheetId(id);
      const data = await getTimesheetById(id);
      setEditingTimesheet(data);
      setActiveTab('timesheet');
      setFeedback({ type: 'success', text: 'Đã tải bản ghi chấm công để chỉnh sửa.' });
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getApiErrorMessage(error, 'Không lấy được chi tiết chấm công.'),
      });
    } finally {
      setEditingTimesheetId(null);
    }
  }

  async function handleEditLeaveRequest(id) {
    try {
      setEditingLeaveRequestId(id);
      const data = await getLeaveRequestById(id);
      setEditingLeaveRequest(data);
      setActiveTab('leave');
      setFeedback({ type: 'success', text: 'Đã tải đơn nghỉ phép để chỉnh sửa.' });
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getApiErrorMessage(error, 'Không lấy được chi tiết đơn nghỉ phép.'),
      });
    } finally {
      setEditingLeaveRequestId(null);
    }
  }

  async function handleDeleteTimesheet(id) {
    const confirmed = window.confirm('Bạn có chắc muốn xóa bản ghi chấm công này không?');
    if (!confirmed) {
      return;
    }

    try {
      setDeletingTimesheetId(id);
      await deleteTimesheet(id);

      if (editingTimesheet?.id === id) {
        setEditingTimesheet(null);
      }

      setFeedback({ type: 'success', text: 'Đã xóa bản ghi chấm công.' });
      await loadTimesheets();
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getApiErrorMessage(error, 'Không thể xóa bản ghi chấm công.'),
      });
    } finally {
      setDeletingTimesheetId(null);
    }
  }

  async function handleDeleteLeaveRequest(id) {
    const confirmed = window.confirm('Bạn có chắc muốn xóa đơn nghỉ phép này không?');
    if (!confirmed) {
      return;
    }

    try {
      setDeletingLeaveRequestId(id);
      await deleteLeaveRequest(id);

      if (editingLeaveRequest?.id === id) {
        setEditingLeaveRequest(null);
      }

      setFeedback({ type: 'success', text: 'Đã xóa đơn nghỉ phép.' });
      await loadLeaveRequests();
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getApiErrorMessage(error, 'Không thể xóa đơn nghỉ phép.'),
      });
    } finally {
      setDeletingLeaveRequestId(null);
    }
  }

  return (
    <section className="section section--soft management-section" id="workspace">
      <div className="container">
        <div className="section-heading reveal">
          <span className="section-badge">CRUD Demo Workspace</span>
          <h2>Demo quản lý chấm công timesheet và xin nghỉ phép</h2>
        </div>

        <div className="management-shell reveal reveal--delay">
          <div className="management-shell__header">
            <div className="management-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`management-tab ${activeTab === tab.id ? 'management-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={`management-feedback management-feedback--${feedback.type}`}>
              {feedback.text}
            </div>
          </div>

          {activeTab === 'timesheet' ? (
            <div className="management-grid">
              <TimesheetForm
                initialData={editingTimesheet}
                onSubmit={handleTimesheetSubmit}
                onCancel={() => setEditingTimesheet(null)}
                isSubmitting={isSavingTimesheet}
              />
              <TimesheetList
                items={timesheets}
                isLoading={isLoadingTimesheets}
                editingId={editingTimesheetId}
                deletingId={deletingTimesheetId}
                onEdit={handleEditTimesheet}
                onDelete={handleDeleteTimesheet}
              />
            </div>
          ) : (
            <div className="management-grid">
              <LeaveRequestForm
                initialData={editingLeaveRequest}
                onSubmit={handleLeaveRequestSubmit}
                onCancel={() => setEditingLeaveRequest(null)}
                isSubmitting={isSavingLeaveRequest}
              />
              <LeaveRequestList
                items={leaveRequests}
                isLoading={isLoadingLeaveRequests}
                editingId={editingLeaveRequestId}
                deletingId={deletingLeaveRequestId}
                onEdit={handleEditLeaveRequest}
                onDelete={handleDeleteLeaveRequest}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ManagementSection;
