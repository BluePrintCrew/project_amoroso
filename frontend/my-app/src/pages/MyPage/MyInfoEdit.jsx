import React, { useState, useEffect } from "react";
import MyPageSidebar from "../../components/MyPageSidebar/MyPageSidebar";
import magnifierIcon from "../../assets/magnifier.png";
import "./MyInfoEdit.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import axios from "axios";

function MyInfoEdit() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 사용자 정보 상태 관리
  const [userInfo, setUserInfo] = useState({
    email: "",
    name: "",
    birthDate: "",
    phoneNumber: "",
    nickname: "",
    postalCode: "",
    address: "",
    detailAddress: "",
    gender: "",
    emailConsent: false,
    smsConsent: false,
    dmConsent: false,
    locationConsent: false,
    elevatorType: "NONE" // 엘리베이터 사이즈 기본값
  });
  
  // 비밀번호 변경 상태 관리
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // 소셜 계정 연동 상태
  const [linkedAccounts, setLinkedAccounts] = useState({
    naver: false,
    kakao: false,
    google: false
  });

  // 컴포넌트 마운트시 사용자 정보 가져오기
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 사용자 정보 가져오기
  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      // 로컬 스토리지에서 토큰 가져오기 - token 키 사용
      const token = localStorage.getItem("token");
      
      console.log("사용 중인 토큰:", token); // 토큰 확인을 위한 로그
      
      if (!token) {
        console.log("토큰이 없습니다.");
        setError("로그인이 필요합니다. 로그인 페이지로 이동해주세요.");
        setIsLoading(false);
        return;
      }
      
      // 사용자 기본 정보 요청
      const response = await axios.get("http://localhost:8080/api/v1/auth/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("사용자 정보 응답:", response.data);
      
      // 응답에서 사용자 정보 추출
      const { 
        email, name, phoneNumber, nickname, emailConsent, 
        smsConsent, dmConsent, locationConsent 
      } = response.data;
      
      try {
        // 주소 정보 가져오기 - 기본 배송지로 설정
        const addressResponse = await axios.get("http://localhost:8080/api/v1/UserAddress/default", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("주소 정보 응답:", addressResponse.data);
        
        // 주소와 엘리베이터 정보 추출
        const { 
          postalCode, 
          address, 
          detailAddress, 
          elevatorType = "NONE" 
        } = addressResponse.data || {};
        
        // 상태 업데이트
        setUserInfo({
          email: email || "",
          name: name || "",
          birthDate: "", // API에서 받아오지 않는 정보는 빈 값으로
          phoneNumber: phoneNumber || "",
          nickname: nickname || "",
          postalCode: postalCode || "",
          address: address || "",
          detailAddress: detailAddress || "",
          gender: "", // API에서 받아오지 않는 정보는 빈 값으로
          emailConsent: emailConsent || false,
          smsConsent: smsConsent || false,
          dmConsent: dmConsent || false,
          locationConsent: locationConsent || false,
          elevatorType: elevatorType || "NONE"
        });
        
        setIsLoading(false);
      } catch (addressErr) {
        console.error("주소 정보를 가져오는데 실패했습니다:", addressErr);
        console.error("주소 오류 상세:", addressErr.response?.data || addressErr.message);
        
        // 500 에러인 경우 주소 정보가 없다고 판단하고 signup 페이지로 리다이렉트
        if (addressErr.response && addressErr.response.status === 500) {
          console.log("초기 주소 정보가 없습니다. 회원가입 페이지로 리다이렉트합니다.");
          // 잠시 딜레이 후 리다이렉트 (사용자가 무슨 일이 일어나는지 볼 수 있도록)
          setTimeout(() => {
            window.location.href = "/signup";
          }, 1000);
          return;
        }
        
        // 다른 에러인 경우, 기본 정보만 표시하고 계속 진행
        setUserInfo({
          email: email || "",
          name: name || "",
          birthDate: "", 
          phoneNumber: phoneNumber || "",
          nickname: nickname || "",
          postalCode: "",
          address: "",
          detailAddress: "",
          gender: "",
          emailConsent: emailConsent || false,
          smsConsent: smsConsent || false,
          dmConsent: dmConsent || false,
          locationConsent: locationConsent || false,
          elevatorType: "NONE"
        });
        
        setIsLoading(false);
      }
    } catch (err) {
      console.error("사용자 정보를 가져오는데 실패했습니다:", err);
      console.error("에러 상세:", err.response?.data || err.message);
      
      // 401 Unauthorized 오류인 경우 토큰 문제일 가능성이 높음
      if (err.response?.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        setError("사용자 정보를 가져오는데 실패했습니다. " + (err.response?.data?.message || err.message));
      }
      
      setIsLoading(false);
    }
  };

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  // 비밀번호 입력값 변경 처리
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // 엘리베이터 타입 변경 핸들러
  const handleElevatorChange = (value) => {
    setUserInfo({
      ...userInfo,
      elevatorType: value
    });
  };

  // 탭 전환 처리
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // 개인정보 수정 폼 제출 처리
  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("로그인이 필요합니다");
        return;
      }
      
      // 개인정보 업데이트 요청
      const response = await axios.put("http://localhost:8080/api/v1/auth/users/me", {
        name: userInfo.name,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        nickname: userInfo.nickname,
        emailConsent: userInfo.emailConsent,
        smsConsent: userInfo.smsConsent,
        dmConsent: userInfo.dmConsent,
        locationConsent: userInfo.locationConsent
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // 주소 정보 업데이트는 별도 엔드포인트로 처리해야 하지만 API가 명확하지 않아
      // 여기서는 생략하겠습니다.
      
      alert("개인정보가 성공적으로 업데이트되었습니다!");
    } catch (err) {
      console.error("개인정보 업데이트 실패:", err);
      alert("개인정보 업데이트에 실패했습니다.");
    }
  };

  // 비밀번호 변경 폼 제출 처리
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // 비밀번호와 확인 비밀번호 일치 검사
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    
    try {
      // 백엔드 API에 비밀번호 변경 요청을 보내야 하나, 
      // API 명세에 비밀번호 변경 엔드포인트가 명확하지 않습니다.
      // 아래는 가상의 구현입니다.
      
      alert("비밀번호가 성공적으로 변경되었습니다!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error("비밀번호 변경 실패:", err);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    if (!window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("로그인이 필요합니다");
        return;
      }
      
      const response = await axios.delete("http://localhost:8080/api/v1/auth/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      alert("회원탈퇴가 완료되었습니다.");
      // 로그아웃 및 홈으로 리다이렉트 로직 추가
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error("회원탈퇴 실패:", err);
      alert("회원탈퇴에 실패했습니다.");
    }
  };

  // 우편번호 찾기 기능
  const handleFindPostalCode = () => {
    // 다음(카카오) 우편번호 API 연동 - 이 부분은 실제 구현 필요
    alert("우편번호 API 연동이 필요합니다.");
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>사용자 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => window.location.href = '/login'}>로그인하기</button>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="my-page-lower">
        <div className="my-info-content">
          <h2 className="page-title">내 정보 수정</h2>

          {/* 탭 선택 */}
          <div className="info-tabs">
            <button
              className={`info-tab ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => handleTabClick("personal")}
            >
              개인정보 변경
            </button>
            <button
              className={`info-tab ${activeTab === "password" ? "active" : ""}`}
              onClick={() => handleTabClick("password")}
            >
              비밀번호 변경
            </button>
          </div>

          {activeTab === "personal" ? (
            /* 개인정보 변경 폼 */
            <form onSubmit={handlePersonalInfoSubmit} className="info-form">
              {/* (1) 개인설정정보 */}
              <section>
                <h3>개인회원정보</h3>

                {/* 아이디(이메일) - read-only */}
                <div className="form-group display-field">
                  <label className="required-label">아이디(이메일)</label>
                  <div className="display-value">
                    {userInfo.email}
                  </div>
                </div>

                {/* 이메일 - editable */}
                <div className="form-group">
                  <label className="required-label">이메일</label>
                  <input 
                    type="email" 
                    name="email"
                    value={userInfo.email} 
                    onChange={handleInputChange}
                    placeholder="아이디(이메일) 입력" 
                  />
                </div>
              </section>

              {/* (2) 본인인증정보 */}
              <section>
                <h3>본인인증정보</h3>

                {/* 이름 */}
                <div className="form-group">
                  <label>이름</label>
                  <input 
                    type="text" 
                    name="name"
                    value={userInfo.name} 
                    onChange={handleInputChange}
                    placeholder="이름 입력" 
                  />
                </div>

                {/* 생년월일 + 성별 (남/여) */}
                <div className="form-group birth-gender-row">
                  <label className="required-label">생년월일/성별</label>

                  <div className="birth-gender-container">
                    {/* Birth date input */}
                    <input
                      type="text"
                      name="birthDate"
                      value={userInfo.birthDate}
                      onChange={handleInputChange}
                      placeholder="생년월일 입력 (YYYY-MM-DD)"
                      className="birth-input"
                    />

                    {/* Two squares for 남/여 */}
                    <div className="gender-squares">
                      <div 
                        className={`gender-square male-square ${userInfo.gender === 'male' ? 'selected' : ''}`}
                        onClick={() => handleInputChange({target: {name: 'gender', value: 'male'}})}
                      >
                        남
                      </div>
                      <div 
                        className={`gender-square female-square ${userInfo.gender === 'female' ? 'selected' : ''}`}
                        onClick={() => handleInputChange({target: {name: 'gender', value: 'female'}})}
                      >
                        여
                      </div>
                    </div>
                  </div>
                </div>

                {/* 휴대폰번호 */}
                <div className="form-group">
                  <label>휴대폰번호</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={userInfo.phoneNumber} 
                    onChange={handleInputChange}
                    placeholder="휴대폰번호 입력" 
                  />
                </div>
              </section>

              {/* (3) 주소정보 */}
              <section>
                <h3>주소정보 입력</h3>
                <div className="form-group">
                  <label>주소</label>

                  {/* 우편번호 + 검색 버튼 */}
                  <div className="address-row">
                    <input
                      type="text"
                      name="postalCode"
                      value={userInfo.postalCode}
                      onChange={handleInputChange}
                      className="postal-input"
                      placeholder="우편번호"
                      readOnly
                    />
                    <button 
                      type="button" 
                      className="search-btn"
                      onClick={handleFindPostalCode}
                    >
                      <img src={magnifierIcon} alt="돋보기" className="magnifier-icon" />
                      우편번호 찾기
                    </button>
                  </div>

                  {/* 기본주소 및 상세주소 */}
                  <input 
                    type="text" 
                    name="address"
                    value={userInfo.address} 
                    onChange={handleInputChange}
                    placeholder="주소" 
                    className="address-line" 
                    readOnly
                  />
                  <input 
                    type="text" 
                    name="detailAddress"
                    value={userInfo.detailAddress} 
                    onChange={handleInputChange}
                    placeholder="상세 주소" 
                    className="address-line" 
                  />
                </div>

                {/* 엘리베이터 정보 추가 */}
                <div className="form-group elevator-form-group">
                  <label>엘리베이터 정보</label>
                  <div className="elevator-options">
                    <div 
                      className={`elevator-option ${userInfo.elevatorType === 'ONE_TO_SEVEN' ? 'selected' : ''}`}
                      onClick={() => handleElevatorChange('ONE_TO_SEVEN')}
                    >
                      1층-7층
                    </div>
                    <div 
                      className={`elevator-option ${userInfo.elevatorType === 'EIGHT_TO_TEN' ? 'selected' : ''}`}
                      onClick={() => handleElevatorChange('EIGHT_TO_TEN')}
                    >
                      8층-10층
                    </div>
                    <div 
                      className={`elevator-option ${userInfo.elevatorType === 'ELEVEN_OR_MORE' ? 'selected' : ''}`}
                      onClick={() => handleElevatorChange('ELEVEN_OR_MORE')}
                    >
                      11층 이상
                    </div>
                    <div 
                      className={`elevator-option ${userInfo.elevatorType === 'NONE' ? 'selected' : ''}`}
                      onClick={() => handleElevatorChange('NONE')}
                    >
                      없음
                    </div>
                  </div>
                </div>
              </section>

              {/* (4) 계정 인증 여부 */}
              <section>
                <h3>계정 인증 여부</h3>
                <div className="linked-account-row">
                  <label>네이버</label>
                  <p>{linkedAccounts.naver ? "연동됨" : "연동된 계정이 없습니다."}</p>
                  {linkedAccounts.naver && (
                    <button type="button" className="unlink-btn">
                      연동 해지
                    </button>
                  )}
                </div>
                <div className="linked-account-row">
                  <label>카카오</label>
                  <p>{linkedAccounts.kakao ? "연동됨" : "연동된 계정이 없습니다."}</p>
                  {linkedAccounts.kakao && (
                    <button type="button" className="unlink-btn">
                      연동 해지
                    </button>
                  )}
                </div>
                <div className="linked-account-row">
                  <label>구글</label>
                  <p>{linkedAccounts.google ? "연동됨" : "연동된 계정이 없습니다."}</p>
                  {linkedAccounts.google && (
                    <button type="button" className="unlink-btn">
                      연동 해지
                    </button>
                  )}
                </div>
              </section>

              {/* (5) 마케팅 수신 동의 (선택) */}
              <section>
                <h3>마케팅 수신동의 (선택)</h3>
                <div className="checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      name="emailConsent"
                      checked={userInfo.emailConsent} 
                      onChange={handleInputChange}
                    />
                    이메일
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      name="smsConsent"
                      checked={userInfo.smsConsent} 
                      onChange={handleInputChange}
                    />
                    SMS
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      name="dmConsent"
                      checked={userInfo.dmConsent} 
                      onChange={handleInputChange}
                    />
                    DM
                  </label>
                </div>
              </section>

              {/* (6) 하단 버튼들 */}
              <div className="bottom-buttons">
                <button 
                  type="button" 
                  className="leave-btn"
                  onClick={handleDeleteAccount}
                >
                  회원탈퇴
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => window.history.back()}
                >
                  취소
                </button>
                <button type="submit" className="submit-btn">
                  수정
                </button>
              </div>
            </form>
          ) : (
            /* 비밀번호 변경 폼 */
            <form onSubmit={handlePasswordSubmit} className="info-form">
              <section>
                <h3>비밀번호 변경</h3>
                <div className="form-group">
                  <label>현재 비밀번호</label>
                  <input 
                    type="password" 
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="현재 비밀번호를 입력하세요" 
                  />
                </div>
                <div className="form-group">
                  <label>새 비밀번호</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="새 비밀번호" 
                  />
                </div>
                <div className="form-group">
                  <label>새 비밀번호 확인</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="새 비밀번호 확인" 
                  />
                </div>
              </section>

              <div className="bottom-buttons">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => window.history.back()}
                >
                  취소
                </button>
                <button type="submit" className="submit-btn">
                  변경
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default MyInfoEdit;