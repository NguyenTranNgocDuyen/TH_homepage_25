const attendanceRows = [
  { name: 'Nguyễn Trần Ngọc Duyên', department: 'Kỹ thuật', checkIn: '08:03', status: 'Đúng giờ' },
  { name: 'Võ Hà Như Thủy', department: 'Kinh doanh', checkIn: '08:10', status: 'Đi muộn' },
  { name: 'Nguyễn A', department: 'Thiết kế', checkIn: '07:56', status: 'Đúng giờ' },
  { name: 'Nguyễn B', department: 'Nhân sự', checkIn: '08:01', status: 'Đúng giờ' },
];

const barHeights = ['72%', '88%', '61%', '95%', '79%', '68%', '91%'];

function DashboardPreview() {
  return (
    <section className="section" id="dashboard">
      <div className="container dashboard-section">
        <div className="section-heading reveal">
          <span className="section-badge">Dashboard Preview</span>
        </div>

        <div className="dashboard-mockup reveal reveal--delay">
          {/* Sidebar mimics navigation inside an admin dashboard */}
          <aside className="dashboard-mockup__sidebar">
            <div className="dashboard-brand">
              <span>TP</span>
              <div>
                <strong>TimeSheet Pro</strong>
                <small>Admin Workspace</small>
              </div>
            </div>

            <nav className="dashboard-nav">
              <a className="active" style={{ cursor: 'default' }}>
                Dashboard
              </a>
              <a style={{ cursor: 'default' }}>Nhân sự</a>
              <a style={{ cursor: 'default' }}>Timesheet</a>
              <a style={{ cursor: 'default' }}>Xin nghỉ phép</a>
              <a style={{ cursor: 'default' }}>Báo cáo</a>
              <a style={{ cursor: 'default' }}>Cài đặt</a>
            </nav>

            <div className="sidebar-card">
              <span>Tuần này</span>
              <strong>1,284 giờ</strong>
              <p>Thời gian làm việc được ghi nhận trên toàn công ty.</p>
            </div>
          </aside>

          <div className="dashboard-mockup__main">
            {/* Main workspace shows KPIs, table data and chart preview */}
            <div className="dashboard-topbar">
              <div>
                <span className="dashboard-topbar__tag">Overview</span>
                <h3>Bảng điều khiển chấm công doanh nghiệp</h3>
              </div>
              <div className="dashboard-topbar__actions">
                <button type="button" className="button button--secondary">
                  Xuất báo cáo
                </button>
                <div className="user-pill">
                  <span>AD</span>
                  <strong>Admin HR</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-stats">
              <article className="dashboard-stat">
                <span>Tổng nhân sự</span>
                <strong>186</strong>
                <small>+4 so với tháng trước</small>
              </article>
              <article className="dashboard-stat">
                <span>Check-in hôm nay</span>
                <strong>173</strong>
                <small>93% hoàn thành</small>
              </article>
              <article className="dashboard-stat">
                <span>Đơn chờ duyệt</span>
                <strong>21</strong>
                <small>7 nghỉ phép, 14 chỉnh công</small>
              </article>
              <article className="dashboard-stat">
                <span>Hiệu suất trung bình</span>
                <strong>89%</strong>
                <small>Ổn định trong 4 tuần</small>
              </article>
            </div>

            <div className="dashboard-content-grid">
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <h4>Bảng chấm công hôm nay</h4>
                    <p>Cập nhật theo thời gian thực theo phòng ban</p>
                  </div>
                  <span className="status-badge status-badge--success">Live</span>
                </div>

                <div className="attendance-table">
                  <div className="attendance-table__head">
                    <span>Nhân viên</span>
                    <span>Phòng ban</span>
                    <span>Check-in</span>
                    <span>Trạng thái</span>
                  </div>
                  {attendanceRows.map((row) => (
                    <div className="attendance-table__row" key={row.name}>
                      <span>{row.name}</span>
                      <span>{row.department}</span>
                      <span>{row.checkIn}</span>
                      <span
                        className={`status-badge ${row.status === 'Đi muộn' ? 'status-badge--warning' : 'status-badge--success'
                          }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="dashboard-sidepanels">
                <article className="dashboard-panel dashboard-panel--compact">
                  <div className="panel-heading">
                    <div>
                      <h4>Tiến độ công việc</h4>
                      <p>Theo nhóm trong tuần</p>
                    </div>
                  </div>
                  <div className="task-status-list">
                    <div className="task-status-item">
                      <span>Hoàn thành</span>
                      <strong>72%</strong>
                    </div>
                    <div className="task-status-item">
                      <span>Đang xử lý</span>
                      <strong>18%</strong>
                    </div>
                    <div className="task-status-item">
                      <span>Quá hạn</span>
                      <strong>10%</strong>
                    </div>
                  </div>
                </article>

                <article className="dashboard-panel dashboard-panel--compact">
                  <div className="panel-heading">
                    <div>
                      <h4>Biểu đồ giờ làm</h4>
                      <p>7 ngày gần nhất</p>
                    </div>
                  </div>
                  <div className="bar-chart">
                    {barHeights.map((height, index) => (
                      <div className="bar-chart__item" key={height}>
                        <div className="bar-chart__bar" style={{ height }} />
                        <span>T{index + 2}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;
