import { Link } from 'react-router-dom';

function AboutPage() {
  const coreValues = [
    {
      title: 'Tối ưu hiệu suất',
      desc: 'Chúng tôi tin rằng công nghệ phải là đòn bẩy giúp doanh nghiệp bứt phá mọi giới hạn về thời gian.',
      icon: '🚀'
    },
    {
      title: 'Minh bạch tuyệt đối',
      desc: 'Mọi dữ liệu chấm công và quản lý đều được ghi nhận rõ ràng, giúp xây dựng văn hóa tin cậy.',
      icon: '💎'
    },
    {
      title: 'Thiết kế tinh tế',
      desc: 'Trải nghiệm người dùng (UX) và giao diện (UI) là trái tim trong mọi sản phẩm của TimeSheet Pro.',
      icon: '✨'
    }
  ];

  const teamMembers = [
    { name: 'Nguyễn Trần Ngọc Duyên', role: 'Software Developer', avatar: '👩‍💻' },
    { name: 'Võ Hà Như Thủy', role: 'Business Analyst', avatar: '👩‍💼' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="section hero" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="section-heading" style={{ margin: '0 auto', textAlign: 'center', maxWidth: '800px' }}>
            <span className="section-badge" style={{ marginBottom: '20px' }}>👋 Chào mừng bạn</span>
            <h1 style={{ fontSize: 'clamp(2.8rem, 5vw, 4rem)', lineHeight: '1.1', marginBottom: '24px' }}>
              Về Chúng Tôi <br />
              <span style={{ background: 'linear-gradient(90deg, #ffe08a, #e8b923)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                TimeSheet Pro
              </span>
            </h1>
            <p className="hero__description" style={{ margin: '0 auto', fontSize: '1.2rem' }}>
              Chúng tôi xây dựng phần mềm quản lý chấm công không chỉ để đếm giờ, mà để trân trọng từng giây phút bạn cống hiến.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section section--soft">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span className="section-badge">Câu chuyện của chúng tôi</span>
          <h2 style={{ fontSize: '2.4rem', margin: '20px 0', lineHeight: '1.2' }}>Hành trình từ một ý tưởng nhỏ đến giải pháp toàn diện</h2>
          <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.6' }}>
            Khởi đầu từ <strong>2026</strong>, TimeSheet Pro ra đời để giải quyết triệt để bài toán chấm công thủ công tốn kém thời gian. Chúng tôi mang đến nền tảng quản lý thông minh, tối ưu tự động và đậm chất hiện đại.
          </p>
          <Link to="/#features" className="button button--primary button--large">Khám phá tính năng</Link>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'center', margin: '0 auto 60px' }}>
            <span className="section-badge">Giá trị cốt lõi</span>
            <h2 style={{ fontSize: '2.5rem' }}>Những gì định hình chúng tôi</h2>
          </div>
          <div className="feature-grid">
            {coreValues.map((value, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-card__icon" style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
                  {value.icon}
                </div>
                <h3 style={{ fontSize: '1.4rem' }}>{value.title}</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section section--soft" style={{ paddingBottom: '120px' }}>
        <div className="container">
          <div className="section-heading">
            <span className="section-badge">Đội ngũ</span>
            <h2 style={{ fontSize: '2.5rem' }}>Những người đứng sau TimeSheet Pro</h2>
            <p>Sự kết hợp giữa kinh nghiệm quản trị và sức trẻ của dân công nghệ.</p>
          </div>

          <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {teamMembers.map((member, idx) => (
              <div key={idx} className="hero-dashboard" style={{ padding: '30px 20px', textAlign: 'center' }}>
                <div style={{
                  fontSize: '3rem',
                  width: '80px', height: '80px',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, rgba(232, 185, 35, 0.18), rgba(247, 223, 138, 0.16))',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {member.avatar}
                </div>
                <h4 style={{ margin: '0 0 5px', fontSize: '1.2rem' }}>{member.name}</h4>
                <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutPage;
