import { useEffect, useState } from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { getAuthSession, getDashboardPathByRole } from '../utils/storage';
import { API_CONFIG } from '../config/api';

function WorkspaceTopbar({ onOpenMenu }) {
  const [session, setSession] = useState(() => getAuthSession());
  const navigate = useNavigate();

  useEffect(() => {
    const handleAvatarUpdated = () => {
      setSession(getAuthSession());
    };
    window.addEventListener('avatar_updated', handleAvatarUpdated);
    return () => {
      window.removeEventListener('avatar_updated', handleAvatarUpdated);
    };
  }, []);

  const initials = session?.name
    ? session.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'TP';

  return (
    <header className="topbar" role="banner">
      <div className="topbar__start">
        <button
          type="button"
          className="topbar__menu-button"
          aria-label="Mở menu điều hướng"
          onClick={onOpenMenu}
        >
          <FiMenu />
        </button>

        <label className="topbar__search" htmlFor="workspace-search">
          <FiSearch />
          <input
            id="workspace-search"
            type="search"
            placeholder={getSearchPlaceholder(session?.role)}
          />
        </label>
      </div>

      <div className="topbar__actions">
        <NotificationDropdown userID={session?.userID || session?.id} role={session?.role} />

        <div 
          className="topbar__profile hover:opacity-80 transition-opacity" 
          onClick={() => {
            const basePath = getDashboardPathByRole(session?.role);
            navigate(`${basePath}?section=profile`);
          }}
          style={{ cursor: 'pointer' }}
          title="Xem hồ sơ cá nhân"
        >
          <div className="topbar__avatar" style={{ overflow: 'hidden' }}>
            {session?.avatar ? (
              <img 
                src={session.avatar.startsWith('http') ? session.avatar : `${API_CONFIG.BASE_URL.replace('/api', '')}${session.avatar}`} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              initials
            )}
          </div>
          <div className="topbar__profile-copy">
            <strong>{session?.name || 'Khách truy cập'}</strong>
            <span>
              {session?.role ? getRoleSubtitle(session) : 'Xin chào, chúc bạn một ngày làm việc hiệu quả'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function getSearchPlaceholder(role) {
  if (role === 'manager') {
    return 'Tìm nhân viên, bảng công, đơn nghỉ phép, thông báo...';
  }

  if (isHrWorkspaceRole(role)) {
    return 'Tìm nhân sự, chính sách, báo cáo, thông báo...';
  }

  return 'Tìm kiếm bảng công, đơn nghỉ, thông báo...';
}

function getRoleSubtitle(session) {
  switch (session.role) {
    case 'manager':
      return 'Vai trò: Manager | Phạm vi: nhân sự trực thuộc';
    case 'hr':
      return 'Vai trò: HR | Quản trị nhân sự và chính sách';
    case 'admin':
      return 'Vai trò: Admin | Quản trị nhân sự và chính sách';
    case 'employee':
      return `Vai trò: Employee | Hình thức đăng nhập: ${session.provider || 'password'}`;
    default:
      return `Vai trò: ${session.role}`;
  }
}

function isHrWorkspaceRole(role) {
  return role === 'hr' || role === 'admin';
}

export default WorkspaceTopbar;
