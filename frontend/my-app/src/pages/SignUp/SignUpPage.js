import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';
import PageLayout from '../../components/PageLayout/PageLayout';
import { API_BASE_URL } from '../MyPage/api';

const MyInfoEdit = () => {
  const navigate = useNavigate();

  // 상태 변수 선언
  const [activeTab, setActiveTab] = useState('personal');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // 엘리베이터 정보
  const [elevatorType, setElevatorType] = useState('NONE');
  
  // 약관 동의 상태
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [dmConsent, setDmConsent] = useState(false);
  
  // 소셜 로그인 상태
  const [isSocialLogin, setIsSocialLogin] = useState(true);
  const [socialProvider, setSocialProvider] = useState('');

  // 컴포넌트 마운트 시 사용자 정보 불러오기
  useEffect(() => {
    fetchUserInfo();
  }, []);
  
  // 사용자 정보 불러오기
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      
      // 토큰 가져오기
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }
      
      // 소셜 로그인 정보 가져오기
      const provider = localStorage.getItem('social_provider');
      if (provider) {
        setSocialProvider(provider);
        setIsSocialLogin(true);
      }
      
      try {
        // 사용자 프로필 정보 가져오기
        const response = await axios.get(`${API_BASE_URL}/api/v1/auth/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const userData = response.data;
        
        // 기본 정보 설정
        if (userData.email) setEmail(userData.email);
        if (userData.name) setName(userData.name);
        if (userData.phoneNumber) setPhoneNumber(userData.phoneNumber);
        if (userData.birthDate) setBirthDate(userData.birthDate);
        if (userData.postalCode) setZipcode(userData.postalCode);
        if (userData.address) setAddress(userData.address);
        if (userData.detailAddress) setDetailAddress(userData.detailAddress);
        
        // 마케팅 정보 설정
        if (userData.emailConsent !== undefined) setEmailConsent(userData.emailConsent);
        if (userData.smsConsent !== undefined) setSmsConsent(userData.smsConsent);
        if (userData.dmConsent !== undefined) setDmConsent(userData.dmConsent);
        
      } catch (apiError) {
        console.warn('사용자 정보 불러오기 실패:', apiError);
        // 개발 중에는 에러가 발생해도 계속 진행
        
        // 캐시된 사용자 정보가 있으면 로드
        const cachedProfile = localStorage.getItem('user_profile');
        if (cachedProfile) {
          try {
            const profileData = JSON.parse(cachedProfile);
            if (profileData.email) setEmail(profileData.email);
            if (profileData.name) setName(profileData.name);
            if (profileData.phoneNumber) setPhoneNumber(profileData.phoneNumber);
            if (profileData.postalCode) setZipcode(profileData.postalCode);
            if (profileData.address) setAddress(profileData.address);
            if (profileData.detailAddress) setDetailAddress(profileData.detailAddress);
            if (profileData.emailConsent !== undefined) setEmailConsent(profileData.emailConsent);
            if (profileData.smsConsent !== undefined) setSmsConsent(profileData.smsConsent);
            if (profileData.dmConsent !== undefined) setDmConsent(profileData.dmConsent);
          } catch (e) {
            console.error('캐시된 프로필 파싱 오류:', e);
          }
        }
      }
    } catch (err) {
      console.error('사용자 정보 조회 오류:', err);
      setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 우편번호 찾기 핸들러
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
  
  // 엘리베이터 타입 변경 핸들러
  const handleElevatorChange = (type) => {
    setElevatorType(type);
  };
  
  // 마케팅 동의 변경 핸들러
  const handleMarketingChange = (type, checked) => {
    switch (type) {
      case 'email':
        setEmailConsent(checked);
        break;
      case 'sms':
        setSmsConsent(checked);
        break;
      case 'dm':
        setDmConsent(checked);
        break;
      default:
        break;
    }
  };
  
  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // 사용자 프로필 업데이트 데이터
      const updateData = {
        name: name,
        email: email,
        birthDate: birthDate,
        phoneNumber: phoneNumber,
        postalCode: zipcode,
        address: address,
        detailAddress: detailAddress,
        emailConsent: emailConsent,
        smsConsent: smsConsent,
        dmConsent: dmConsent
      };
      
      const token = localStorage.getItem('access_token');
      
      try {
        // 프로필 업데이트 API 호출
        const response = await axios.put(
          `${API_BASE_URL}/api/v1/auth/users/me`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        console.log('프로필 업데이트 성공:', response.data);
        setSuccess(true);
        
        // 성공 메시지 표시 후 잠시 후 삭제
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
        
      } catch (apiError) {
        console.warn('API 호출 실패, 개발 모드로 진행:', apiError);
        
        // 개발 목적으로 로컬 스토리지에 저장
        localStorage.setItem('user_profile', JSON.stringify(updateData));
        
        // 개발 모드에서는 성공으로 간주
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
      
    } catch (err) {
      console.error('정보 수정 실패:', err);
      setError('정보 수정에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('social_provider');
    navigate('/login');
  };

  return (
    <PageLayout>
    <div className="my-info-container">
      <h1 className="page-title">내 정보 수정</h1>
      
      {/* 개발 모드 알림 */}
      <div className="dev-mode-banner">
        <p>개발 모드: API 연동 전 프론트엔드 기능 테스트 중입니다.</p>
      </div>
      
      {/* 탭 네비게이션 - 소셜 로그인만 사용하므로 개인정보 변경 탭만 표시 */}
      <div className="tabs-container">
        <div 
          className="tab active"
        >
          개인정보 변경
        </div>
      </div>
        
        {/* 성공/에러 메시지 */}
        {success && (
          <div className="success-message">
            정보가 성공적으로 수정되었습니다.
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {/* 개인정보 변경 탭 */}
        {activeTab === 'personal' && (
          <form onSubmit={handleSubmit} className="info-form">
            {/* 소셜 로그인 정보 */}
            {isSocialLogin && (
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
            )}
            
            <div className="form-section">
              <h3>개인회원정보</h3>
              
              {/* 아이디/이메일 */}
              <div className="input-group">
                <label htmlFor="email">아이디(이메일)</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  disabled={true}
                  readOnly
                />
              </div>
              
              {/* 이메일 */}
              <div className="input-group">
                <label htmlFor="displayEmail">이메일</label>
                <input 
                  type="email" 
                  id="displayEmail" 
                  value={email}
                  disabled={true}
                  readOnly
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>본인인증정보</h3>
              
              {/* 이름 */}
              <div className="input-group">
                <label htmlFor="name">이름</label>
                <input 
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              {/* 생년월일/성별 */}
              <div className="input-group">
                <label htmlFor="birthDate">생년월일/성별</label>
                <div className="birth-gender-container">
                  <input 
                    type="text"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="생년월일 입력 (YYYY-MM-DD)"
                    className="birth-input"
                  />
                  <div className="gender-buttons">
                    <button 
                      type="button" 
                      className={`gender-button ${gender === 'male' ? 'selected' : ''}`}
                      onClick={() => setGender('male')}
                    >
                      남
                    </button>
                    <button 
                      type="button" 
                      className={`gender-button ${gender === 'female' ? 'selected' : ''}`}
                      onClick={() => setGender('female')}
                    >
                      여
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 휴대폰번호 */}
              <div className="input-group">
                <label htmlFor="phoneNumber">휴대폰번호</label>
                <input 
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="휴대폰번호 입력 (-없이 숫자만 입력)"
                  required
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>주소정보 입력</h3>
              
              {/* 우편번호 */}
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
              
              {/* 주소 */}
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
              
              {/* 상세주소 */}
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
            </div>
            
            {/* 마케팅 수신 동의 */}
            <div className="form-section">
              <h3>마케팅 수신 동의</h3>
              <div className="marketing-options">
                <div className="marketing-option">
                  <input 
                    type="checkbox" 
                    id="email-consent" 
                    checked={emailConsent}
                    onChange={(e) => handleMarketingChange('email', e.target.checked)}
                  />
                  <label htmlFor="email-consent">이메일</label>
                </div>
                <div className="marketing-option">
                  <input 
                    type="checkbox" 
                    id="sms-consent" 
                    checked={smsConsent}
                    onChange={(e) => handleMarketingChange('sms', e.target.checked)}
                  />
                  <label htmlFor="sms-consent">SMS</label>
                </div>
                <div className="marketing-option">
                  <input 
                    type="checkbox" 
                    id="dm-consent" 
                    checked={dmConsent}
                    onChange={(e) => handleMarketingChange('dm', e.target.checked)}
                  />
                  <label htmlFor="dm-consent">DM</label>
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
                className="logout-button" 
                onClick={handleLogout}
              >
                로그아웃
              </button>
              <button 
                className="submit-button" 
                type="submit" 
                disabled={loading}
              >
                {loading ? '처리 중...' : '정보 수정'}
              </button>
            </div>
          </form>
        )}
        
        {/* 비밀번호 변경 탭 (소셜 로그인이 아닌 경우에만 표시) */}
        {activeTab === 'password' && !isSocialLogin && (
          <div className="password-tab">
            <p className="tab-description">
              비밀번호를 변경하실 수 있습니다. 주기적인 비밀번호 변경을 통해 개인정보를 안전하게 보호하세요.
            </p>
            <form className="password-form">
              <div className="input-group">
                <label htmlFor="current-password">현재 비밀번호</label>
                <input 
                  type="password" 
                  id="current-password" 
                  placeholder="현재 비밀번호 입력"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="new-password">새 비밀번호</label>
                <input 
                  type="password" 
                  id="new-password" 
                  placeholder="8~15자 이내의 영문,숫자,특수문자 조합"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirm-password">새 비밀번호 확인</label>
                <input 
                  type="password" 
                  id="confirm-password" 
                  placeholder="새 비밀번호 확인"
                  required
                />
              </div>
              <button className="submit-button" type="submit">
                비밀번호 변경
              </button>
            </form>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MyInfoEdit;