import React from 'react';
import './SignUpPage.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const SignUpPage = () => {
  return (
    <div>
      {/* 헤더 */}
      <div className="header-container">
        <Header />
      </div>

         {/* 네비게이션 */}
      <div className="navigation-container">
        <div className="navigation-item">
          <img src="/path/to/home-icon.png" alt="홈 아이콘" />
          홈
        </div>
        <span className="navigation-separator">/</span>
        <div className="navigation-item navigation-active">회원가입</div>
      </div>

      {/* 회원가입 메인 컨테이너 */}
      <div className="signup-container">
        {/* 제목 */}
        <h1 className="signup-title">회원정보 입력</h1>
        <p className="signup-subtitle">로그인에 사용할 정보를 입력해주세요.</p>

        {/* 아이디 입력 */}
        <div className="input-group">
          <label htmlFor="email">아이디</label>
          <input type="email" id="email" placeholder="아이디(이메일) 입력" />
        </div>

        {/* 비밀번호 입력 */}
        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="8~15자 이내의 영문,숫자,특수문자의 조합이어야 합니다."
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="input-group">
          <label htmlFor="confirm-password">비밀번호 확인</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="비밀번호 확인"
          />
        </div>

        {/* 주소 입력 */}
        <div className="address-group">
          <input type="text" className="zipcode" placeholder="우편번호" />
          <button className="search-button">우편번호 찾기</button>
        </div>
        <div className="input-group">
          <input type="text" placeholder="주소" />
        </div>
        <div className="input-group">
          <input type="text" placeholder="상세주소" />
        </div>

        {/* 약관 동의 */}
        <div className="agreement-section">
          <h3>Amoroso 서비스 이용약관에 동의해주세요.</h3>
          <div className="agreement-item">
            <input type="checkbox" id="all-agree" />
            <label htmlFor="all-agree">전체 동의</label>
          </div>
          <div className="agreement-introduction">
            Amoroso 서비스 통합이용약관, 개인정보 수집 및 이용, 위치정보 이용약관(선택), 마케팅 수신(선택)에 모두 동의합니다.
            선택항목 동의를 거부하셔도 서비스 이용이 가능합니다.
          </div>
          <div className="agreement-item">
            <input type="checkbox" id="terms-agree" />
            <label htmlFor="terms-agree">
              Amoroso (회원) 서비스 통합이용약관 동의
            </label>
            <span className="required">(필수)</span>
          </div>
          <div className="agreement-item">
            <input type="checkbox" id="privacy-agree" />
            <label htmlFor="privacy-agree">개인정보 수집 및 이용 동의</label>
            <span className="required">(필수)</span>
          </div>
          <div className="agreement-item">
            <input type="checkbox" id="marketing-agree" />
            <label htmlFor="marketing-agree">마케팅 수신 동의</label>
          </div>
          <div className="agreement-item">
            <input type="checkbox" id="age-agree" />
            <label htmlFor="age-agree">만 14세 이상입니다.</label>
            <span className="required">(필수)</span>
          </div>
        </div>

        {/* 가입 버튼 */}
        <button className="submit-button">본인인증하고 가입완료하기</button>
      </div>

      {/* 푸터 */}
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default SignUpPage;
