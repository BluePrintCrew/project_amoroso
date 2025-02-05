import React from 'react';
import './Temp.css';

function SignupPage() {
  return (
    <div className="signup-container">
      {/* 상단 헤더 영역 */}
      <header className="header">
        <div className="logo">Amoroso</div>
        <nav className="nav-menu">
          <ul>
            <li>홈퍼니싱</li>
            <li>인테리어</li>
          </ul>
        </nav>
        <div className="search-box">
          <input type="text" placeholder="검색어를 입력해 주세요..." />
          <button>검색</button>
        </div>
        <div className="right-icons">
          <button>장바구니</button>
          <button>MY</button>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content">
        <h2>회원 로그인</h2>
        <form className="login-form">
          <label htmlFor="userId" className="input-label">
            아이디
          </label>
          <input
            type="text"
            id="userId"
            className="input-field"
            placeholder="ID 또는 이메일ID"
          />

          <label htmlFor="password" className="input-label">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            className="input-field"
            placeholder="비밀번호"
          />

          <div className="save-id-box">
            <label>
              <input type="checkbox" />
              아이디저장
            </label>
          </div>

          <button type="submit" className="login-button">
            로그인
          </button>

          <div className="social-login">
            <span>간편 로그인</span>
            <div className="social-icons">
              {/* 아이콘 이미지는 별도 파일을 import하거나 CDN을 활용 */}
              <button className="social-icon">N</button>
              <button className="social-icon">K</button>
              <button className="social-icon">G</button>
            </div>
          </div>

          <div className="help-links">
            <button>아이디/비밀번호 찾기</button>
            <button>회원가입</button>
          </div>
        </form>
      </main>

      {/* 하단 푸터 영역 */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#company">회사소개</a>
          <a href="#terms">이용약관</a>
          <a href="#privacy">개인정보처리방침</a>
        </div>
        <div className="company-info">
          <p>고객센터 이용안내 (평일 09:00 - 18:00, 토요일 09:00 - 13:00)</p>
          <p>(주)Amoroso 대표: 홍길동</p>
          <p>서울특별시 가나구 다란로 123</p>
          <p>사업자등록번호: 123-45-6789 | 개인정보보호 책임자: 홍길동</p>
          <p>Tel: 1234-5678 | Email: info@amoroso.co.kr</p>
        </div>
      </footer>
    </div>
  );
}

export default SignupPage;
