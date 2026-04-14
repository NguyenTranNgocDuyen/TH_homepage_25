import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-mark">TP</span>
          <div>
            <strong>TimeSheet Pro</strong>
            <span>Smart Time Tracking</span>
          </div>
        </Link>

        <nav className="navbar__menu">
          <Link to="/" className="navbar__link">Trang chủ</Link>
          <Link to="/about-us" className="navbar__link">Giới thiệu</Link>
          <a href="/#features" className="navbar__link">Tính năng</a>
          <a href="/#process" className="navbar__link">Quy trình</a>
          <a href="#footer" className="navbar__link">Liên hệ</a>
        </nav>

        <div className="navbar__actions">
          <button type="button" className="button button--ghost">
            Đăng nhập
          </button>
          <button type="button" className="button button--primary">
            Bắt đầu
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
