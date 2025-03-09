import React, { useState } from 'react';
import axios from 'axios';
import './SignUpPage.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const SignUpPage = () => {
  // 상태 변수 선언
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');            // 이름 추가
  const [phoneNumber, setPhoneNumber] = useState(''); // 전화번호 추가
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 폼 제출 핸들러 (API 연동)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 실제 API 요청에 필요한 데이터 (이메일, 비밀번호, 이름, 전화번호)
    const registrationData = {
      email,
      password,
      name,
      phoneNumber
    };

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/auth/register',
        registrationData
      );
      console.log('회원가입 성공:', response.data);
      // 가입 성공 후 추가 처리 (예: 페이지 이동, 성공 메시지 표시 등)
    } catch (err) {
      console.error('회원가입 실패:', err);
      setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="signup-title">회원정보 입력</h1>
        <p className="signup-subtitle">로그인에 사용할 정보를 입력해주세요.</p>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* 아이디(이메일) */}
          <div className="input-group">
            <label htmlFor="email">아이디</label>
            <input 
              type="email" 
              id="email" 
              placeholder="아이디(이메일) 입력" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 */}
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input 
              type="password" 
              id="password" 
              placeholder="8~15자 이내의 영문,숫자,특수문자 조합" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="input-group">
            <label htmlFor="confirm-password">비밀번호 확인</label>
            <input 
              type="password" 
              id="confirm-password" 
              placeholder="비밀번호 확인" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* 이름 입력 */}
          <div className="input-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* 전화번호 입력 */}
          <div className="input-group">
            <label htmlFor="phoneNumber">전화번호</label>
            <input
              type="text"
              id="phoneNumber"
              placeholder="전화번호 입력"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          {/* 주소 입력 */}
          <div className="address-group">
            <input 
              type="text" 
              className="zipcode" 
              placeholder="우편번호" 
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            />
            <button type="button" className="search-button">우편번호 찾기</button>
          </div>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="주소" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="상세주소" 
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
            />
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
              <label htmlFor="terms-agree">Amoroso (회원) 서비스 통합이용약관 동의</label>
              <span className="required">(필수)</span>
            </div>
            <div className="agreement-item">
              <input type="checkbox" id="privacy-agree" />
              <label htmlFor="privacy-agree">개인정보 수집 및 이용 동의</label>
              <span className="required">(필수)</span>
            </div>
            <div className="agreement-item-marketing">
              <div className="marketing-header">
                <input type="checkbox" id="marketing-agree" />
                <label htmlFor="marketing-agree">
                  마케팅 수신 동의 <span className="optional">(선택)</span>
                </label>
                <div className="coupon-info">5% 쿠폰(최대 10,000원)</div>
              </div>
              <div className="marketing-options">
                <div className="option-item">
                  <input type="checkbox" id="email-agree" />
                  <label htmlFor="email-agree">이메일</label>
                </div>
                <div className="option-item">
                  <input type="checkbox" id="sms-agree" />
                  <label htmlFor="sms-agree">SMS</label>
                </div>
                <div className="option-item">
                  <input type="checkbox" id="dm-agree" />
                  <label htmlFor="dm-agree">DM</label>
                </div>
              </div>
              <p className="marketing-description">
                Amoroso에서 제공하는 정보 등을 받으실 수 있습니다. 단, 상품 구매정보는
                수신동의 여부에 관계없이 발송됩니다.
              </p>
            </div>
            <div className="agreement-item">
              <input type="checkbox" id="age-agree" />
              <label htmlFor="age-agree">만 14세 이상입니다.</label>
              <span className="required">(필수)</span>
            </div>
          </div>

          {/* 가입 버튼 */}
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? '가입 중...' : '본인인증하고 가입완료하기'}
          </button>
        </form>
      </div>

      {/* 푸터 */}
      {/* <div className="footer-container">
        <Footer />
      </div> */}
    </div>
  );
};

export default SignUpPage;
