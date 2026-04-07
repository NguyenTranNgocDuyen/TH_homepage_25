import { FiBarChart2, FiCheckSquare, FiClipboard, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getAuthSession } from '../utils/storage';
import './EmployeeDashboard.css';

function ManagerDashboard() {
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
          <div className="dashboard-pill">Manager Dashboard</div>
          <h1>Dashboard Quan ly</h1>
          <p>Kiem tra phe duyet bang cong, don nghi phep va tinh hinh nhan su theo nhom.</p>
        </div>
        <div className="dashboard-hero__stats">
          <div className="dashboard-hero__mini-card">
            <span>Nguoi dung</span>
            <strong>{session?.name || 'Manager User'}</strong>
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
          <div className="dashboard-stat-card__icon"><FiClipboard /></div>
          <span>Duyet bang cong</span>
          <strong>18 yeu cau</strong>
          <p>Cac ban ghi dang cho quan ly xac nhan.</p>
        </article>
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card__icon"><FiCheckSquare /></div>
          <span>Duyet don nghi phep</span>
          <strong>05 don</strong>
          <p>Cac yeu cau nghi phep can xu ly hom nay.</p>
        </article>
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card__icon"><FiBarChart2 /></div>
          <span>Theo doi nhan vien</span>
          <strong>24 nhan su</strong>
          <p>Danh sach nhan vien dang thuoc quyen quan ly.</p>
        </article>
      </section>

      <section className="dashboard-panel role-dashboard__panel">
        <div className="dashboard-panel__heading">
          <div>
            <span className="dashboard-panel__eyebrow">Session Control</span>
            <h2>Trang thai dang nhap hien tai</h2>
            <p>Token mock, role va provider duoc nap ngay sau khi SSO hoan tat.</p>
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

export default ManagerDashboard;
