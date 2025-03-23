import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PageLayout from '../../components/PageLayout/PageLayout';
import { API_BASE_URL } from '../MyPage/api';

const SignUpPage = () => {
  const navigate = useNavigate();

  // 상태 변수 선언
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 엘리베이터 정보
  const [elevatorType, setElevatorType] = useState('NONE');
  
  // 약관 동의 상태
  const [allAgree, setAllAgree] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const [ageAgree, setAgeAgree] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [dmConsent, setDmConsent] = useState(false);
  
  // 소셜 로그인으로부터 리다이렉트된 경우의 정보
  const [isSocialLogin, setIsSocialLogin] = useState(false);
  const [socialToken, setSocialToken] = useState('');

  // 컴포넌트 마운트 시 소셜 로그인 토큰 확인
  useEffect(() => {
    // URL에서 토큰 파라미터 확인 또는 localStorage에서 확인
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // 소셜 로그인 후 추가 정보 입력을 위해 리다이렉트된 경우
      setIsSocialLogin(true);
      setSocialToken(token);
      
      // 토큰으로 기본 정보 가져오기
      fetchUserBasicInfo(token);
    }
  }, []);
  
  // 토큰이 있는 경우 기본 사용자 정보 가져오기
  const fetchUserBasicInfo = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/auth/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // 가져온 정보로 폼 초기화
      const { email: userEmail, name: userName, phoneNumber: userPhone } = response.data;
      
      if (userEmail) setEmail(userEmail);
      if (userName) setName(userName);
      if (userPhone) setPhoneNumber(userPhone);
      
      // 소셜 로그인 사용자는 비밀번호 입력 불필요
      if (isSocialLogin) {
        setPassword('social-login-no-password');
        setConfirmPassword('social-login-no-password');
      }
      
    } catch (err) {
      console.error('사용자 기본 정보 가져오기 실패:', err);
    }
  };

  // 전체 동의 핸들러
  const handleAllAgree = (e) => {
    const checked = e.target.checked;
    setAllAgree(checked);
    setTermsAgree(checked);
    setPrivacyAgree(checked);
    setAgeAgree(checked);
    setMarketingAgree(checked);
    setEmailConsent(checked);
    setSmsConsent(checked);
    setDmConsent(checked);
  };
  
  // 마케팅 동의 핸들러
  const handleMarketingAgree = (e) => {
    const checked = e.target.checked;
    setMarketingAgree(checked);
    if (!checked) {
      setEmailConsent(false);
      setSmsConsent(false);
      setDmConsent(false);
    }
  };
  
  // 개별 약관 동의 변경 시 전체 동의 상태 업데이트
  useEffect(() => {
    if (termsAgree && privacyAgree && ageAgree && marketingAgree && 
        emailConsent && smsConsent && dmConsent) {
      setAllAgree(true);
    } else {
      setAllAgree(false);
    }
  }, [termsAgree, privacyAgree, ageAgree, marketingAgree, emailConsent, smsConsent, dmConsent]);
  
  // 엘리베이터 타입 변경 핸들러
  const handleElevatorChange = (type) => {
    setElevatorType(type);
  };

  // 우편번호 찾기 핸들러 (카카오 주소 API 활용)
  const handleFindZipcode = () => {
    // 카카오 주소 검색 API가 로드되어 있는지 확인
    if (!window.daum || !window.daum.Postcode) {
      // 카카오 주소 검색 API 스크립트 로드
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => openPostcode();
      document.head.appendChild(script);
    } else {
      openPostcode();
    }
  };
  
  // 카카오 우편번호 검색 창 열기
  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 선택한 주소 정보를 폼에 반영
        setZipcode(data.zonecode);
        setAddress(data.address);
        // 상세주소 입력란에 포커스
        document.getElementById('detailAddress').focus();
      }
    }).open();
  };

  // 테스트 계정 생성 (테스트용)
  const createTestAccount = async () => {
    try {
      // 테스트 계정 생성 API 호출
      const response = await axios.post(`${API_BASE_URL}/api/v1/Test-User/setup/USER`);
      console.log('테스트 계정 생성 성공:', response.data);
      
      // 발급된 토큰 저장
      if (response.data && response.data.token) {
        localStorage.setItem('access_token', response.data.token);
        return response.data.token;
      }
      return null;
    } catch (err) {
      console.error('테스트 계정 생성 실패:', err);
      return null;
    }
  };

  // 폼 제출 핸들러 (API 연동)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 약관 동의 확인
    if (!termsAgree || !privacyAgree || !ageAgree) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    // 비밀번호 일치 여부 확인 (소셜 로그인이 아닌 경우)
    if (!isSocialLogin && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let token = socialToken;
      
      // 소셜 로그인이 아닌 경우에만 회원가입 API 호출
      if (!isSocialLogin) {
        // 회원가입 API 요청 (이메일, 비밀번호, 이름, 전화번호)
        const registrationData = {
          email,
          password,
          name,
          phoneNumber
        };
        
        try {
          const registerResponse = await axios.post(
            `${API_BASE_URL}/api/v1/auth/register`,
            registrationData
          );
          console.log('회원가입 성공:', registerResponse.data);
          
          // 회원가입 후 로그인하여 토큰 획득
          const loginResponse = await axios.post(
            `${API_BASE_URL}/api/v1/auth/login`,
            { email, password }
          );
          
          token = loginResponse.data.accessToken;
          localStorage.setItem('access_token', token);
        } catch (regErr) {
          console.error('회원가입/로그인 실패:', regErr);
          // 개발 테스트 목적으로 테스트 계정 생성
          token = await createTestAccount();
          if (!token) {
            throw new Error('계정 생성 및 로그인에 실패했습니다.');
          }
        }
      }
      
      // 이제 토큰을 가지고 있으므로 사용자 프로필 업데이트
      try {
        // 사용자 프로필 업데이트 API 호출
        const updateResponse = await axios.put(
          `${API_BASE_URL}/api/v1/auth/users/me`,
          {
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            postalCode: zipcode,
            address: address,
            detailAddress: detailAddress,
            emailConsent: emailConsent,
            smsConsent: smsConsent,
            dmConsent: dmConsent,
            // locationConsent: true // 필요하다면 위치정보 동의 추가
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        console.log('프로필 업데이트 성공:', updateResponse.data);
      } catch (updateErr) {
        console.error('프로필 업데이트 실패:', updateErr);
        // 프로필 업데이트 실패해도 회원가입은 완료된 상태이므로 에러 메시지만 표시
        alert('일부 추가 정보 저장에 실패했습니다. 마이페이지에서 다시 설정해주세요.');
      }
      
      // 가입 성공 메시지와 함께 홈 페이지로 리다이렉트
      alert(isSocialLogin ? '추가 정보 설정이 완료되었습니다.' : '회원가입이 완료되었습니다.');
      
      // 홈으로 리다이렉트
      navigate('/');
      
    } catch (err) {
      console.error('회원가입 프로세스 실패:', err);
      setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageLayout>
        {/* 네비게이션 */}
        <div className="navigation-container">
          <div className="navigation-item">
            <img src="/path/to/home-icon.png" alt="홈 아이콘" />
            홈
          </div>
          <span className="navigation-separator">/</span>
          <div className="navigation-item navigation-active">
            {isSocialLogin ? '추가 정보 입력' : '회원가입'}
          </div>
        </div>

        {/* 회원가입 메인 컨테이너 */}
        <div className="signup-container">
          <h1 className="signup-title">
            {isSocialLogin ? '추가 정보 입력' : '회원정보 입력'}
          </h1>
          <p className="signup-subtitle">
            {isSocialLogin 
              ? '서비스 이용에 필요한 추가 정보를 입력해주세요.' 
              : '로그인에 사용할 정보를 입력해주세요.'}
          </p>
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
                disabled={isSocialLogin} // 소셜 로그인 시 수정 불가
                required
              />
            </div>

            {/* 비밀번호 (소셜 로그인이 아닌 경우에만 표시) */}
            {!isSocialLogin && (
              <>
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
              </>
            )}

            {/* 이름 입력 */}
            <div className="input-group">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                placeholder="이름 입력"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSocialLogin && name} // 소셜 로그인 시 이미 있으면 수정 불가
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
                readOnly
                required
              />
              <button 
                type="button" 
                className="search-button"
                onClick={handleFindZipcode}
              >
                우편번호 찾기
              </button>
            </div>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="주소" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                readOnly
                required
              />
            </div>
            <div className="input-group">
              <input 
                type="text" 
                id="detailAddress"
                placeholder="상세주소" 
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                required
              />
            </div>
            
            {/* 엘리베이터 정보 */}
            <div className="elevator-section">
              <label>엘리베이터 정보</label>
              <div className="elevator-options">
                <div 
                  className={`elevator-option ${elevatorType === 'ONE_TO_SEVEN' ? 'selected' : ''}`}
                  onClick={() => handleElevatorChange('ONE_TO_SEVEN')}
                >
                  1층-7층
                </div>
                <div 
                  className={`elevator-option ${elevatorType === 'EIGHT_TO_TEN' ? 'selected' : ''}`}
                  onClick={() => handleElevatorChange('EIGHT_TO_TEN')}
                >
                  8층-10층
                </div>
                <div 
                  className={`elevator-option ${elevatorType === 'ELEVEN_OR_MORE' ? 'selected' : ''}`}
                  onClick={() => handleElevatorChange('ELEVEN_OR_MORE')}
                >
                  11층 이상
                </div>
                <div 
                  className={`elevator-option ${elevatorType === 'NONE' ? 'selected' : ''}`}
                  onClick={() => handleElevatorChange('NONE')}
                >
                  없음
                </div>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="agreement-section">
              <h3>Amoroso 서비스 이용약관에 동의해주세요.</h3>
              <div className="agreement-item">
                <input 
                  type="checkbox" 
                  id="all-agree" 
                  checked={allAgree}
                  onChange={handleAllAgree}
                />
                <label htmlFor="all-agree">전체 동의</label>
              </div>
              <div className="agreement-introduction">
                Amoroso 서비스 통합이용약관, 개인정보 수집 및 이용, 위치정보 이용약관(선택), 마케팅 수신(선택)에 모두 동의합니다.
                선택항목 동의를 거부하셔도 서비스 이용이 가능합니다.
              </div>
              <div className="agreement-item">
                <input 
                  type="checkbox" 
                  id="terms-agree" 
                  checked={termsAgree}
                  onChange={(e) => setTermsAgree(e.target.checked)}
                  required
                />
                <label htmlFor="terms-agree">Amoroso (회원) 서비스 통합이용약관 동의</label>
                <span className="required">(필수)</span>
              </div>
              <div className="agreement-item">
                <input 
                  type="checkbox" 
                  id="privacy-agree" 
                  checked={privacyAgree}
                  onChange={(e) => setPrivacyAgree(e.target.checked)}
                  required
                />
                <label htmlFor="privacy-agree">개인정보 수집 및 이용 동의</label>
                <span className="required">(필수)</span>
              </div>
              <div className="agreement-item-marketing">
                <div className="marketing-header">
                  <input 
                    type="checkbox" 
                    id="marketing-agree" 
                    checked={marketingAgree}
                    onChange={handleMarketingAgree}
                  />
                  <label htmlFor="marketing-agree">
                    마케팅 수신 동의 <span className="optional">(선택)</span>
                  </label>
                  <div className="coupon-info">5% 쿠폰(최대 10,000원)</div>
                </div>
                <div className="marketing-options">
                  <div className="option-item">
                    <input 
                      type="checkbox" 
                      id="email-agree" 
                      checked={emailConsent}
                      onChange={(e) => setEmailConsent(e.target.checked)}
                      disabled={!marketingAgree}
                    />
                    <label htmlFor="email-agree">이메일</label>
                  </div>
                  <div className="option-item">
                    <input 
                      type="checkbox" 
                      id="sms-agree" 
                      checked={smsConsent}
                      onChange={(e) => setSmsConsent(e.target.checked)}
                      disabled={!marketingAgree}
                    />
                    <label htmlFor="sms-agree">SMS</label>
                  </div>
                  <div className="option-item">
                    <input 
                      type="checkbox" 
                      id="dm-agree" 
                      checked={dmConsent}
                      onChange={(e) => setDmConsent(e.target.checked)}
                      disabled={!marketingAgree}
                    />
                    <label htmlFor="dm-agree">DM</label>
                  </div>
                </div>
                <p className="marketing-description">
                  Amoroso에서 제공하는 정보 등을 받으실 수 있습니다. 단, 상품 구매정보는
                  수신동의 여부에 관계없이 발송됩니다.
                </p>
              </div>
              <div className="agreement-item">
                <input 
                  type="checkbox" 
                  id="age-agree" 
                  checked={ageAgree}
                  onChange={(e) => setAgeAgree(e.target.checked)}
                  required
                />
                <label htmlFor="age-agree">만 14세 이상입니다.</label>
                <span className="required">(필수)</span>
              </div>
            </div>

            {/* 가입 버튼 */}
            <button className="submit-button" type="submit" disabled={loading}>
              {loading 
                ? '처리 중...' 
                : (isSocialLogin ? '추가 정보 설정 완료하기' : '본인인증하고 가입완료하기')}
            </button>
          </form>
        </div>
      </PageLayout>
    </div>
  );
};

export default SignUpPage;