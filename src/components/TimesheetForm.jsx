import { useEffect, useState } from 'react';

const timesheetStatuses = ['Present', 'Late', 'Absent', 'EarlyLeave'];

function getTodayValue() {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function createEmptyFormState() {
  return {
    employeeName: '',
    workDate: getTodayValue(),
    checkInTime: '',
    checkOutTime: '',
    status: 'Present',
    note: '',
  };
}

function extractDate(value) {
  return value ? value.slice(0, 10) : getTodayValue();
}

function extractTime(value) {
  return value ? value.slice(11, 16) : '';
}

function mapTimesheetToFormState(initialData) {
  if (!initialData) {
    return createEmptyFormState();
  }

  return {
    employeeName: initialData.employeeName ?? '',
    workDate: extractDate(initialData.workDate),
    checkInTime: extractTime(initialData.checkInTime),
    checkOutTime: extractTime(initialData.checkOutTime),
    status: initialData.status ?? 'Present',
    note: initialData.note ?? '',
  };
}

function formatName(name) {
  if (!name) return '';
  return name.trim().split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

function buildTimesheetPayload(formState) {
  const workDate = formState.workDate;

  return {
    employeeName: formatName(formState.employeeName),
    workDate: `${workDate}T00:00:00`,
    checkInTime: formState.checkInTime ? `${workDate}T${formState.checkInTime}:00` : null,
    checkOutTime: formState.checkOutTime ? `${workDate}T${formState.checkOutTime}:00` : null,
    status: formState.status,
    note: formState.note.trim() || null,
  };
}

function TimesheetForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [formState, setFormState] = useState(createEmptyFormState());
  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    setFormState(mapTimesheetToFormState(initialData));
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
      const payload = buildTimesheetPayload(formState);
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
          <h4>{isEditing ? 'Cập nhật chấm công' : 'Thêm chấm công mới'}</h4>
          <p>Nhập dữ liệu timesheet để gửi lên ASP.NET Core API.</p>
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
              placeholder="Nguyen Van A"
              required
            />
          </label>

          <label className="management-field">
            <span>Ngày làm việc</span>
            <input
              name="workDate"
              type="date"
              value={formState.workDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="management-field">
            <span>Giờ vào</span>
            <input
              name="checkInTime"
              type="time"
              value={formState.checkInTime}
              onChange={handleChange}
            />
          </label>

          <label className="management-field">
            <span>Giờ ra</span>
            <input
              name="checkOutTime"
              type="time"
              value={formState.checkOutTime}
              onChange={handleChange}
            />
          </label>

          <label className="management-field">
            <span>Trạng thái</span>
            <select name="status" value={formState.status} onChange={handleChange}>
              {timesheetStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="management-field management-field--full">
            <span>Ghi chú</span>
            <textarea
              name="note"
              rows="4"
              value={formState.note}
              onChange={handleChange}
              placeholder="Ví dụ: Đi công tác buổi chiều"
            />
          </label>
        </div>

        <div className="management-form__actions">
          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : isEditing ? 'Lưu cập nhật' : 'Thêm chấm công'}
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

export default TimesheetForm;
