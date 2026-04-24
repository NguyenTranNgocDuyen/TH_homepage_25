function formatDate(value) {
  if (!value) {
    return '--';
  }

  return new Date(value).toLocaleDateString('vi-VN');
}

function formatDateTime(value) {
  if (!value) {
    return '--';
  }

  return new Date(value).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function getStatusClass(status) {
  switch (status) {
    case 'Approved':
      return 'status-chip--positive';
    case 'Rejected':
      return 'status-chip--danger';
    default:
      return 'status-chip--warning';
  }
}

function LeaveRequestList({ items, isLoading, editingId, deletingId, onEdit, onDelete }) {
  return (
    <section className="dashboard-panel management-panel">
      <div className="panel-heading management-panel__heading">
        <div>
          <h4>Danh sách đơn nghỉ phép</h4>
          <p>Hiển thị dữ liệu GET từ `api/leaverequests`.</p>
        </div>
        <span className="status-badge status-badge--warning">GET / DELETE</span>
      </div>

      {isLoading ? (
        <div className="management-empty">Đang tải dữ liệu nghỉ phép...</div>
      ) : items.length === 0 ? (
        <div className="management-empty">Chưa có đơn nghỉ phép nào.</div>
      ) : (
        <div className="management-list">
          {items.map((item) => (
            <article className="management-card" key={item.id}>
              <div className="management-card__top">
                <div>
                  <strong>{item.employeeName}</strong>
                  <span>{item.leaveType}</span>
                </div>
                <span className={`status-chip ${getStatusClass(item.status)}`}>{item.status}</span>
              </div>

              <div className="management-meta">
                <span>Từ: {formatDate(item.startDate)}</span>
                <span>Đến: {formatDate(item.endDate)}</span>
                <span>Tạo lúc: {formatDateTime(item.createdAt)}</span>
              </div>

              <p className="management-note">{item.reason}</p>

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

export default LeaveRequestList;
