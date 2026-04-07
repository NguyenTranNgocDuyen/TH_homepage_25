import { FiFileText, FiLogOut, FiShield, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getAuthSession } from '../utils/storage';
import './EmployeeDashboard.css';

function HRDashboard() {
  const navigate = useNavigate();
  const session = getAuthSession();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  return (
    <div className="dashboard-page role-dashboard">
      <section className="dashboard-hero">
        <div className="dashboard-hero__content">
          <div className="dashboard-pill">HR Dashboard</div>
          <h1>Dashboard HR</h1>
          <p>Quan ly nhan su, xuat bao cao luong va kiem soat loai nghi phep trong he thong.</p>
        </div>
        <div className="dashboard-hero__stats">
          <div className="dashboard-hero__mini-card">
            <span>Nguoi dung</span>
            <strong>{session?.name || 'HR User'}</strong>
            <small>Role: {session?.role}</small>
          </div>
          <div className="dashboard-hero__mini-card">
            <span>Session</span>
            <strong>{session?.token ? 'Authenticated' : 'Guest'}</strong>
            <small>{session?.token ? session.token.slice(0, 24) : 'No token'}</small>
          </div>
        </div>
      </section>

      <section className="dashboard-stat-grid dashboard-cards">
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card__icon"><FiUsers /></div>
          <span>Quan ly nhan su</span>
          <strong>186 ho so</strong>
          <p>Du lieu nhan su dang hoat dong tren toan cong ty.</p>
        </article>
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card__icon"><FiFileText /></div>
          <span>Xuat bao cao luong</span>
          <strong>12 bao cao</strong>
          <p>Bo bao cao luong thang da san sang de xuat.</p>
        </article>
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card__icon"><FiShield /></div>
          <span>Quan ly loai nghi phep</span>
          <strong>08 loai</strong>
          <p>Danh muc loai nghi va quy tac dang duoc ap dung.</p>
        </article>
      </section>

      <section className="dashboard-panel role-dashboard__panel">
        <div className="dashboard-panel__heading">
          <div>
            <span className="dashboard-panel__eyebrow">Session Control</span>
            <h2>Trang thai dang nhap hien tai</h2>
            <p>Thong tin session duoc tai chinh xac ngay khi vao dashboard theo role.</p>
          </div>
        </div>

        <div className="dashboard-list">
          <div className="dashboard-list__item"><strong>Email</strong><span>{session?.email}</span></div>
          <div className="dashboard-list__item"><strong>Role</strong><span>{session?.role}</span></div>
          <div className="dashboard-list__item"><strong>Provider</strong><span>{session?.provider}</span></div>
          <div className="dashboard-list__item"><strong>Status</strong><span>{session?.isActive ? 'Active' : 'Inactive'}</span></div>
        </div>

        <div className="dashboard-panel__actions">
          <button type="button" className="dashboard-button dashboard-button--primary" onClick={handleLogout}>
            <FiLogOut />
            Dang xuat
          </button>
        </div>
      </section>
    </div>
  );
}

export default HRDashboard;
