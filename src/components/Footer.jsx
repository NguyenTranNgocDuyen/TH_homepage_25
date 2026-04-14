import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__grid">
        <div>
          <Link to="/" className="footer__brand">
            <span>TP</span>
            <div>
              <strong>TimeSheet Pro</strong>
              <p>Giải pháp giao diện chấm công và quản lý timesheet hiện đại cho doanh nghiệp.</p>
            </div>
          </Link>
        </div>

        <div>
          <h4>Liên kết nhanh</h4>
          <ul className="footer__list">
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/about-us">Giới thiệu</Link>
            </li>
            <li>
              <Link to="/#features">Tính năng</Link>
            </li>
            <li>
              <Link to="/#process">Quy trình</Link>
            </li>
            <li>
              <Link to="/#dashboard">Thống kê</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Liên hệ</h4>
          <ul className="footer__list">
            <li>Email: hello@timesheetpro.vn</li>
            <li>Điện thoại: 033 602 4090</li>
            <li>Địa chỉ: PTIT, TP. HCM</li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© 2026 TimeSheet Pro. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
