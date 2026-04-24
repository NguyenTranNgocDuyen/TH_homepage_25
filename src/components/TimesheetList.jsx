function formatDate(value) {
  if (!value) {
    return '--';
  }

  return new Date(value).toLocaleDateString('vi-VN');
}

function formatTime(value) {
  if (!value) {
    return '--';
  }

  return value.slice(11, 16);
}

function getStatusClass(status) {
  switch (status) {
    case 'Present':
      return 'status-chip--positive';
    case 'Late':
      return 'status-chip--warning';
    case 'Absent':
      return 'status-chip--danger';
    default:
      return 'status-chip--neutral';
  }
}

function TimesheetList({ items, isLoading, editingId, deletingId, onEdit, onDelete }) {
  return (
    <section className="dashboard-panel management-panel">
      <div className="panel-heading management-panel__heading">
        <div>
          <h4>Danh sách chấm công</h4>
          <p>Hiển thị dữ liệu GET từ `api/timesheetentries`.</p>
        </div>
        <span className="status-badge status-badge--warning">GET / DELETE</span>
      </div>

      {isLoading ? (
        <div className="management-empty">Đang tải dữ liệu timesheet...</div>
      ) : items.length === 0 ? (
        <div className="management-empty">Chưa có bản ghi chấm công nào.</div>
      ) : (
        <div className="management-list">
          {items.map((item) => (
            <article className="management-card" key={item.id}>
              <div className="management-card__top">
                <div>
                  <strong>{item.employeeName}</strong>
                  <span>{formatDate(item.workDate)}</span>
                </div>
                <span className={`status-chip ${getStatusClass(item.status)}`}>{item.status}</span>
              </div>

              <div className="management-meta">
                <span>Check-in: {formatTime(item.checkInTime)}</span>
                <span>Check-out: {formatTime(item.checkOutTime)}</span>
              </div>

              <p className="management-note">{item.note || 'Không có ghi chú.'}</p>

              <div className="management-actions">
                <button
                  type="button"
                  className="button button--ghost management-action"
                  onClick={() => onEdit(item.id)}
                  disabled={editingId === item.id || deletingId === item.id}
                >
                  {editingId === item.id ? 'Đang tải...' : 'Sửa'}
                </button>
                <button
                  type="button"
                  className="button button--secondary management-action"
                  onClick={() => onDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default TimesheetList;
