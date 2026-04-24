import { useEffect, useState } from 'react';

const leaveTypes = ['Annual Leave', 'Sick Leave', 'Unpaid Leave'];
const leaveStatuses = ['Pending', 'Approved', 'Rejected'];

function getTodayValue() {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function createEmptyFormState() {
  const today = getTodayValue();

  return {
    employeeName: '',
    leaveType: 'Annual Leave',
    startDate: today,
    endDate: today,
    reason: '',
    status: 'Pending',
  };
}

function extractDate(value) {
  return value ? value.slice(0, 10) : getTodayValue();
}

function mapLeaveRequestToFormState(initialData) {
  if (!initialData) {
    return createEmptyFormState();
  }

  return {
    employeeName: initialData.employeeName ?? '',
    leaveType: initialData.leaveType ?? 'Annual Leave',
    startDate: extractDate(initialData.startDate),
    endDate: extractDate(initialData.endDate),
    reason: initialData.reason ?? '',
    status: initialData.status ?? 'Pending',
  };
}

function formatName(name) {
  if (!name) return '';
  return name.trim().split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

function buildLeaveRequestPayload(formState) {
  return {
    employeeName: formatName(formState.employeeName),
    leaveType: formState.leaveType,
    startDate: `${formState.startDate}T00:00:00`,
    endDate: `${formState.endDate}T00:00:00`,
    reason: formState.reason.trim(),
    status: formState.status,
  };
}

function LeaveRequestForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [formState, setFormState] = useState(createEmptyFormState());
  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    setFormState(mapLeaveRequestToFormState(initialData));
  }, [initialData]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const payload = buildLeaveRequestPayload(formState);
      if (isEditing) {
        payload.id = initialData.id;
      }
      await onSubmit(payload);

      if (!isEditing) {
        setFormState(createEmptyFormState());
      }
    } catch {
      // Parent component already shows the API error message.
    }
  }

  return (
    <section className="dashboard-panel management-panel">
      <div className="panel-heading management-panel__heading">
        <div>
          <h4>{isEditing ? 'Cập nhật đơn nghỉ phép' : 'Tạo đơn nghỉ phép'}</h4>
          <p>Form CRUD nghỉ phép dùng Axios POST và PUT.</p>
        </div>
        <span className="status-badge status-badge--success">POST / PUT</span>
      </div>

      <form className="management-form" onSubmit={handleSubmit}>
        <div className="management-form__grid">
          <label className="management-field">
            <span>Tên nhân viên</span>
            <input
              name="employeeName"
              type="text"
              value={formState.employeeName}
              onChange={handleChange}
              placeholder="Vo Ha Nhu Thuy"
              required
            />
          </label>

          <label className="management-field">
            <span>Loại nghỉ phép</span>
            <select name="leaveType" value={formState.leaveType} onChange={handleChange}>
              {leaveTypes.map((leaveType) => (
                <option key={leaveType} value={leaveType}>
                  {leaveType}
                </option>
              ))}
            </select>
          </label>

          <label className="management-field">
            <span>Ngày bắt đầu</span>
            <input
              name="startDate"
              type="date"
              value={formState.startDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="management-field">
            <span>Ngày kết thúc</span>
            <input
              name="endDate"
              type="date"
              value={formState.endDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="management-field">
            <span>Trạng thái</span>
            <select name="status" value={formState.status} onChange={handleChange}>
              {leaveStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="management-field management-field--full">
            <span>Lý do</span>
            <textarea
              name="reason"
              rows="4"
              value={formState.reason}
              onChange={handleChange}
              placeholder="Ví dụ: Nghỉ phép năm để giải quyết việc gia đình"
              required
            />
          </label>
        </div>

        <div className="management-form__actions">
          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : isEditing ? 'Lưu cập nhật' : 'Tạo đơn nghỉ phép'}
          </button>
          {isEditing && (
            <button
              type="button"
              className="button button--ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Hủy sửa
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default LeaveRequestForm;
