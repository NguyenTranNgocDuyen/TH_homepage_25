import { FiSearch } from 'react-icons/fi';
import NotificationDropdown from './NotificationDropdown';
import { getAuthSession } from '../utils/storage';

function Topbar() {
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
    <header className="topbar">
      <div className="topbar__search">
        <FiSearch />
        <input type="text" placeholder="Tìm kiếm bảng công, đơn nghỉ, thông báo..." />
      </div>

      <div className="topbar__actions">
        <NotificationDropdown userID={session?.userID || session?.id} role={session?.role} />

        <div className="topbar__profile">
          <div className="topbar__avatar">{initials}</div>
          <div>
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

export default Topbar;
