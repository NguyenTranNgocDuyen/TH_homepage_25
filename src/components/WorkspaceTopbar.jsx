import { FiBell, FiSearch } from 'react-icons/fi';
import { getAuthSession } from '../utils/storage';

function WorkspaceTopbar() {
  const session = getAuthSession();
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
        <label className="topbar__search" htmlFor="workspace-search">
          <FiSearch />
          <input
            id="workspace-search"
            type="search"
            placeholder="Tìm kiếm bảng công, đơn nghỉ, thông báo..."
          />
        </label>
      </div>

      <div className="topbar__actions">
        <button className="topbar__icon" type="button" aria-label="Thông báo">
          <FiBell />
          <span>3</span>
        </button>

        <div className="topbar__profile">
          <div className="topbar__avatar">{initials}</div>
          <div className="topbar__profile-copy">
            <strong>{session?.name || 'Khách truy cập'}</strong>
            <span>
              {session?.role
                ? `Vai trò: ${session.role} | Hình thức đăng nhập: ${session.provider || 'password'}`
                : 'Xin chào, chúc bạn một ngày làm việc hiệu quả'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default WorkspaceTopbar;
