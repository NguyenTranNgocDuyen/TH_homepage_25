import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession, getAuthSession } from '../utils/storage';
import {
  DEFAULT_EMPLOYEE_SECTION,
  employeeLogoutItem,
  employeeMenu,
  getEmployeeSectionHref,
} from '../config/employeeMenu';

function WorkspaceSidebar({ isCollapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getAuthSession();
  const currentSection = new URLSearchParams(location.search).get('section') || DEFAULT_EMPLOYEE_SECTION;
  const LogoutIcon = employeeLogoutItem.icon;

  const handleLogout = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  return (
    <aside
      className={`sidebar sidebar--custom-scrollbar${isCollapsed ? ' is-collapsed' : ''}`}
      aria-label="Điều hướng khu vực làm việc"
    >
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <span className="sidebar__brand-mark">TP</span>
          {!isCollapsed ? (
            <div className="sidebar__brand-copy">
              <strong>TimeSheet Pro</strong>
              <small>Khu vực nhân viên</small>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="sidebar__collapse-button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
          title={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <div className="sidebar__content">
        <nav className="sidebar__nav sidebar__nav--scrollbar">
          {employeeMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === '/dashboard/employee' && currentSection === item.key;

            return (
              <button
                key={item.key}
                type="button"
                className={`sidebar__item sidebar__item--button${isCollapsed ? ' sidebar__item--collapsed' : ''}${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => navigate(getEmployeeSectionHref(item.key))}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="sidebar__item-icon">
                  <Icon />
                </span>
                {!isCollapsed ? (
                  <span className="sidebar__item-copy">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="sidebar__bottom">
          <button
            type="button"
            className={`sidebar__item sidebar__item--button sidebar__item--danger${isCollapsed ? ' sidebar__item--collapsed' : ''}`}
            onClick={handleLogout}
            title={isCollapsed ? employeeLogoutItem.label : undefined}
          >
            <span className="sidebar__item-icon">
              <LogoutIcon />
            </span>
            {!isCollapsed ? (
              <span className="sidebar__item-copy">
                <strong>{employeeLogoutItem.label}</strong>
                <small>{employeeLogoutItem.description}</small>
              </span>
            ) : null}
          </button>

          {!isCollapsed ? (
            <div className="sidebar__footer">
              <span>Trạng thái phiên</span>
              <strong>{session?.token ? 'Đã xác thực' : 'Khách'}</strong>
              <p>
                Mục mặc định: Tổng quan. Người dùng: {session?.name || 'Không xác định'}.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export default WorkspaceSidebar;
