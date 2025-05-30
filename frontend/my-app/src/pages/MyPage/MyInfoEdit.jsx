import React, { useState, useEffect } from "react";
import magnifierIcon from "../../assets/magnifier.png";
import "./MyInfoEdit.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import axios from "axios";
import { API_BASE_URL } from "./api";

function MyInfoEdit() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 정보 상태 관리
  const [userInfo, setUserInfo] = useState({
    email: "",
    name: "",
    birthDate: "",
    phoneNumber: "",
    nickname: "hs",
    postalCode: "",
    address: "",
    detailAddress: "",
    emailConsent: false,
    smsConsent: false,
    dmConsent: false,
    locationConsent: false,
  });

  // 소셜 계정 연동 상태
  const [linkedAccounts, setLinkedAccounts] = useState({
    naver: false,
    kakao: false,
    google: false,
  });

  // 컴포넌트 마운트시 사용자 정보 가져오기
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 사용자 정보 가져오기
  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem("access_token");

      console.log("사용 중인 토큰:", token);

      if (!token) {
        console.log("토큰이 없습니다.");
        setError("로그인이 필요합니다. 로그인 페이지로 이동해주세요.");
        setIsLoading(false);
        return;
      }

      // 사용자 기본 정보 요청
      const response = await axios.get(`${API_BASE_URL}/api/v1/auth/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("사용자 정보 응답:", response.data);

      // 응답에서 사용자 정보 추출
      const {
        email,
        name,
        phoneNumber,
        nickname,
        emailConsent,
        smsConsent,
        dmConsent,
        locationConsent,
        birthDate = "",
      } = response.data;

      try {
        // 주소 정보 가져오기 - 기본 배송지로 설정
        const addressResponse = await axios.get(
          `${API_BASE_URL}/api/v1/UserAddress/default`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("주소 정보 응답:", addressResponse.data);

        // 주소 정보 추출
        const { postalCode, address, detailAddress } =
          addressResponse.data || {};

        // 상태 업데이트
        setUserInfo({
          email: email || "",
          name: name || "",
          birthDate: birthDate || "",
          phoneNumber: phoneNumber || "",
          nickname: nickname || "",
          postalCode: postalCode || "",
          address: address || "",
          detailAddress: detailAddress || "",
          emailConsent: emailConsent || false,
          smsConsent: smsConsent || false,
          dmConsent: dmConsent || false,
          locationConsent: locationConsent || false,
        });

        setIsLoading(false);
      } catch (addressErr) {
        console.error("주소 정보를 가져오는데 실패했습니다:", addressErr);

        // 주소 정보 없이 기본 정보만 표시
        setUserInfo({
          email: email || "",
          name: name || "",
          birthDate: birthDate || "",
          phoneNumber: phoneNumber || "",
          nickname: nickname || "",
          postalCode: "",
          address: "",
          detailAddress: "",
          emailConsent: emailConsent || false,
          smsConsent: smsConsent || false,
          dmConsent: dmConsent || false,
          locationConsent: locationConsent || false,
        });

        setIsLoading(false);
      }
    } catch (err) {
      console.error("사용자 정보를 가져오는데 실패했습니다:", err);

      // 401 Unauthorized 오류인 경우 토큰 문제일 가능성이 높음
      if (err.response?.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        setError(
          "사용자 정보를 가져오는데 실패했습니다. " +
          (err.response?.data?.message || err.message)
        );
      }

      setIsLoading(false);
    }
  };

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 날짜 입력의 경우 YYYY-MM-DD 형식으로 저장
    if (name === "birthDate" && value) {
      // HTML date input은 이미 YYYY-MM-DD 형식으로 반환하므로 추가 변환 불필요
      setUserInfo({
        ...userInfo,
        [name]: value,
      });
    } else {
      setUserInfo({
        ...userInfo,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // 개인정보 수정 폼 제출 처리
  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("로그인이 필요합니다");
        return;
      }

      // API 명세서에 맞게 정확히 필드를 구성
      const updateData = {
        name: userInfo.name,
        email: userInfo.email,
        birthDate: userInfo.birthDate, // date picker에서 선택한 날짜 추가 (YYYY-MM-DD 형식)
        phoneNumber: userInfo.phoneNumber,
        nickname: userInfo.nickname,
        postalCode: userInfo.postalCode,
        address: userInfo.address,
        detailAddress: userInfo.detailAddress,
        emailConsent: userInfo.emailConsent,
        smsConsent: userInfo.smsConsent,
        dmConsent: userInfo.dmConsent,
        locationConsent: userInfo.locationConsent,
      };

      console.log("전송 데이터:", JSON.stringify(updateData, null, 2));

      // 개인정보 업데이트 요청
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/users/me`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("응답 데이터:", response.data);
      alert("개인정보가 성공적으로 업데이트되었습니다!");
    } catch (err) {
      console.error("개인정보 업데이트 실패:", err);

      // 자세한 오류 정보 출력
      if (err.response) {
        console.error("에러 상태:", err.response.status);
        console.error("에러 데이터:", err.response.data);
      }

      alert(
        "개인정보 업데이트에 실패했습니다: " +
        (err.response?.data?.message || err.message || "알 수 없는 오류")
      );
    }
  };

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    if (!window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("로그인이 필요합니다");
        return;
      }

      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/auth/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("회원탈퇴가 완료되었습니다.");
      // 로그아웃 및 홈으로 리다이렉트
      localStorage.removeItem("access_token");
      window.location.href = "/";
    } catch (err) {
      console.error("회원탈퇴 실패:", err);
      alert("회원탈퇴에 실패했습니다.");
    }
  };

  // 우편번호 찾기 기능
  const handleFindPostalCode = () => {
    // 카카오 주소 검색 API가 로드되어 있는지 확인
    if (!window.daum || !window.daum.Postcode) {
      // 카카오 주소 검색 API 스크립트 로드
      const script = document.createElement("script");
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.onload = () => openPostcode();
      document.head.appendChild(script);
    } else {
      openPostcode();
    }
  };

  // 카카오 우편번호 검색 창 열기
  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 선택한 주소 정보를 폼에 반영
        setUserInfo({
          ...userInfo,
          postalCode: data.zonecode,
          address: data.address,
        });
        // 상세주소 입력란에 포커스
        document.getElementById("detailAddress")?.focus();
      },
    }).open();
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
        <button onClick={() => (window.location.href = "/login")}>
          로그인하기
        </button>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="my-page-lower">
        <div className="my-info-content">
          <h2 className="page-title">내 정보 수정</h2>

          {/* 개인정보 변경 폼 */}
          <form onSubmit={handlePersonalInfoSubmit} className="info-form">
            {/* (1) 개인설정정보 */}
            <section>
              <h3>개인회원정보</h3>

              {/* 아이디(이메일) - read-only */}
              <div className="form-group display-field">
                <label className="required-label">아이디(이메일)</label>
                <div className="display-value">{userInfo.email}</div>
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
                  {/* Birth date input - changed to date type */}
                  <input
                    type="date"
                    name="birthDate"
                    value={userInfo.birthDate}
                    onChange={handleInputChange}
                    className="birth-input"
                  />

                  {/* Two squares for 남/여 */}
                  <div className="gender-squares">
                    <div
                      className={`gender-square male-square ${userInfo.gender === "male" ? "selected" : ""
                        }`}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "gender", value: "male" },
                        })
                      }
                    >
                      남
                    </div>
                    <div
                      className={`gender-square female-square ${userInfo.gender === "female" ? "selected" : ""
                        }`}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "gender", value: "female" },
                        })
                      }
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
                    <img
                      src={magnifierIcon}
                      alt="돋보기"
                      className="magnifier-icon"
                    />
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
                  id="detailAddress"
                  name="detailAddress"
                  value={userInfo.detailAddress}
                  onChange={handleInputChange}
                  placeholder="상세 주소"
                  className="address-line"
                />
              </div>
            </section>

            {/* (4) 계정 인증 여부 */}
            <section>
              <h3>계정 인증 여부</h3>
              <div className="linked-account-row">
                <label>네이버</label>
                <p>
                  {linkedAccounts.naver ? "연동됨" : "연동된 계정이 없습니다."}
                </p>
              </div>
              <div className="linked-account-row">
                <label>카카오</label>
                <p>
                  {linkedAccounts.kakao ? "연동됨" : "연동된 계정이 없습니다."}
                </p>
              </div>
              <div className="linked-account-row">
                <label>구글</label>
                <p>
                  {linkedAccounts.google ? "연동됨" : "연동된 계정이 없습니다."}
                </p>
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
        </div>
      </div>
    </PageLayout>
  );
}

export default MyInfoEdit;
