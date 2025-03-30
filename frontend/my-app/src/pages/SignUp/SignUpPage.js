import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './SignUpPage.css';
import PageLayout from '../../components/PageLayout/PageLayout';

// API 기본 URL 설정
const API_BASE_URL = 'http://localhost:8080';

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 변수 선언
  const [email, setEmail] = useState('');
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
  
  // 소셜 로그인 관련 정보
  const [socialToken, setSocialToken] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const [socialProvider, setSocialProvider] = useState(''); // 'kakao', 'naver', 'google' 등
  const [pageTitle, setPageTitle] = useState('회원정보 입력');

  // 컴포넌트 마운트 시 소셜 로그인 토큰 확인
  useEffect(() => {
    // URL 파라미터 또는 로컬 스토리지에서 토큰 확인
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token') || localStorage.getItem('access_token');
    const provider = queryParams.get('provider') || localStorage.getItem('social_provider');
    
    if (token) {
      setSocialToken(token);
      localStorage.setItem('access_token', token);
      
      if (provider) {
        setSocialProvider(provider);
        localStorage.setItem('social_provider', provider);
      }
      
      // 토큰으로 사용자 정보 확인
      fetchUserInfo(token);
    } else {
      // 개발 중인 경우 테스트 모드로 진행 (추후 배포 시 아래 주석 해제)
       navigate('/login', { replace: true });
      console.log('개발 테스트 모드로 진행');
    }
  }, [location, navigate]);
  
  // 토큰으로 사용자 정보 조회
  const fetchUserInfo = async (token) => {
    try {
      setLoading(true);
      
      // API 요청 전 테스트: 현재는 개발 중이므로 API 요청을 시도하지만
      // 실패할 경우 기본값으로 처리합니다
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/auth/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const userData = response.data;
        
        // 사용자 기본 정보 설정
        if (userData.email) setEmail(userData.email);
        if (userData.name) setName(userData.name);
        if (userData.phoneNumber) setPhoneNumber(userData.phoneNumber);
        
        // 추가 정보가 이미 있는지 확인하여 신규/기존 사용자 구분
        if (userData.postalCode && userData.address) {
          setIsNewUser(false);
          setPageTitle('회원정보 수정');
          
          // 기존 사용자의 경우 저장된 정보 불러오기
          setZipcode(userData.postalCode || '');
          setAddress(userData.address || '');
          setDetailAddress(userData.detailAddress || '');
          
          // 동의 정보 불러오기
          setEmailConsent(userData.emailConsent || false);
          setSmsConsent(userData.smsConsent || false);
          setDmConsent(userData.dmConsent || false);
          
          // 마케팅 동의 여부는 하위 동의 중 하나라도 있으면 true
          setMarketingAgree(userData.emailConsent || userData.smsConsent || userData.dmConsent || false);
          
          // 주소 정보가 있으면 필수 동의는 이미 한 것으로 간주
          setTermsAgree(true);
          setPrivacyAgree(true);
          setAgeAgree(true);
        } else {
          setIsNewUser(true);
          setPageTitle('회원정보 입력');
        }
      } catch (apiError) {
        console.warn('API 호출 오류, 개발 모드로 진행:', apiError);
        // 개발 중일 때는 API 호출이 실패해도 계속 진행
        setIsNewUser(true);
        setPageTitle('회원정보 입력');
        
        // URL 또는 쿼리 파라미터에서 기본 정보 가져오기 시도
        const queryParams = new URLSearchParams(location.search);
        const emailParam = queryParams.get('email');
        if (emailParam) setEmail(emailParam);
      }
    } catch (err) {
      console.error('사용자 정보 조회 오류:', err);
      setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
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

  // 폼 제출 핸들러 (API 연동)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 신규 사용자인 경우 필수 약관 동의 확인
    if (isNewUser && (!termsAgree || !privacyAgree || !ageAgree)) {
      setError('필수 약관에 동의해주세요.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      // 사용자 프로필 업데이트 데이터 - 백엔드 UserUpdateRequest 형식에 맞춤
      const updateData = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        nickname: name,
        postalCode: zipcode,
        address: address,
        detailAddress: detailAddress,
        emailConsent: true,
        smsConsent: true,
        dmConsent: true,
        locationConsent: false,
        // 중요: elevatorType 추가
        elevatorType: elevatorType
      };
      
      console.log('전송할 데이터:', updateData);
      
      // API 호출 시도
      const updateResponse = await axios.put(
        `${API_BASE_URL}/api/v1/auth/users/me`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${socialToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('프로필 업데이트 성공:', updateResponse.data);
      
      // 가입/수정 성공 메시지와 함께 홈 페이지로 리다이렉트
      alert(isNewUser ? '회원가입이 완료되었습니다.' : '회원정보가 수정되었습니다.');
      navigate('/');
      
    } catch (err) {
      // 자세한 에러 로깅
      console.error('에러 상세 정보:', err.response?.data || '응답 데이터 없음');
      console.error('에러 상태 코드:', err.response?.status);
      
      setError('정보 저장에 실패했습니다. 입력 정보를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };
  // 취소 버튼 핸들러
  const handleCancel = () => {
    // 신규 사용자인 경우 로그인 페이지로, 기존 사용자인 경우 마이페이지로 이동
    if (isNewUser) {
      // 토큰 삭제 후 로그인 페이지로
      localStorage.removeItem('access_token');
      localStorage.removeItem('social_provider');
      navigate('/login');
    } else {
      navigate('/mypage');
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
            {pageTitle}
          </div>
        </div>

        {/* 개발 모드 알림 */}
        <div className="dev-mode-banner">
          <p>개발 모드: API 연동 전 프론트엔드 기능 테스트 중입니다.</p>
        </div>

        {/* 회원가입/정보수정 메인 컨테이너 */}
        <div className="signup-container">
          <h1 className="signup-title">{pageTitle}</h1>
          <p className="signup-subtitle">
            {isNewUser 
              ? '서비스 이용에 필요한 정보를 입력해주세요.' 
              : '회원정보를 수정할 수 있습니다.'}
          </p>
          {error && <div className="error-message">{error}</div>}
          
          {/* 소셜 로그인 정보 표시 */}
          <div className="social-login-info">
            <div className="social-icon">
              {socialProvider === 'kakao' && <img src="/path/to/kakao-icon.png" alt="카카오 로그인" />}
              {socialProvider === 'naver' && <img src="/path/to/naver-icon.png" alt="네이버 로그인" />}
              {socialProvider === 'google' && <img src="/path/to/google-icon.png" alt="구글 로그인" />}
              {!socialProvider && <span className="dev-badge">개발 테스트</span>}
            </div>
            <div className="social-text">
              {socialProvider === 'kakao' && '카카오 계정으로 로그인'}
              {socialProvider === 'naver' && '네이버 계정으로 로그인'}
              {socialProvider === 'google' && '구글 계정으로 로그인'}
              {!socialProvider && '소셜 로그인 계정으로 진행'}
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* 이메일 (소셜 로그인에서 가져온 값) */}
            <div className="input-group">
              <label htmlFor="email">이메일</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true} // 소셜 로그인에서 받아온 이메일은 수정 불가
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
                placeholder="전화번호 입력 (-없이 숫자만 입력)"
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

            {/* 약관 동의 (신규 사용자인 경우에만 표시) */}
            {isNewUser && (
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
            )}
            
            {/* 마케팅 수신 동의 (신규/기존 사용자 모두 표시) */}
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
                {isNewUser && <div className="coupon-info">5% 쿠폰(최대 10,000원)</div>}
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

            {/* 버튼 영역 */}
            <div className="button-group">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={handleCancel}
              >
                취소
              </button>
              <button 
                className="submit-button" 
                type="submit" 
                disabled={loading}
              >
                {loading 
                  ? '처리 중...' 
                  : (isNewUser ? '가입완료' : '정보수정')}
              </button>
            </div>
          </form>
        </div>
      </PageLayout>
    </div>
  );
};

export default SignUpPage;