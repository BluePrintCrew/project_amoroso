import React, { useState } from "react";
import MyPageSidebar from "../../components/MyPageSidebar/MyPageSidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
// If you want a magnifier icon in the postal code button, import it:
// import magnifierIcon from "../../assets/magnifier.png";
import "./MyInfoEdit.css";

function MyInfoEdit() {
  const [activeTab, setActiveTab] = useState("personal");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted (dummy).");
  };

  const handleCancel = () => {
    alert("Canceled (dummy).");
  };

  return (
    <>
      <Header />

      <div className="my-page-lower">
        <MyPageSidebar />

        <div className="my-info-content">
          <h2 className="page-title">내 정보 수정</h2>

          {/* Tabs row */}
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
            <form onSubmit={handleSubmit} className="info-form">
              {/* (1) 개인설정정보 */}
              <section>
                <h3>개인회원정보</h3>

                {/* 아이디(이메일) - read-only */}
                <div className="form-group display-field">
                  <label className="required-label">아이디(이메일)</label>
                  <div className="display-value">
                    계정 아이디가 들어갑니다. (읽기전용)
                  </div>
                </div>
                {/* optional divider line: <hr className="field-divider" /> */}

                {/* 이메일 - editable */}
                <div className="form-group">
                  <label className="required-label">이메일</label>
                  <input type="email" placeholder="아이디(이메일) 입력" />
                </div>
                {/* optional divider line: <hr className="field-divider" /> */}
              </section>

              {/* (2) 본인 인증 정보 */}
              <section>
                <h3>본인인증정보</h3>
                <div className="form-group">
                  <label>이름</label>
                  <input type="text" placeholder="이름을 입력하세요" />
                </div>

                <div className="form-group birth-gender-row">
                  <label>생년월일</label>
                  <input type="text" placeholder="YYYYMMDD" className="birth-input" />
                  <select>
                    <option>성별</option>
                    <option value="male">남</option>
                    <option value="female">여</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>휴대폰번호</label>
                  <input type="tel" placeholder="휴대폰번호를 입력하세요" />
                </div>
              </section>

              {/* (3) 주소정보 입력 */}
              <section>
                <h3>주소정보 입력</h3>
                <div className="form-group">
                  <label>주소</label>
                  <div className="address-row">
                    <input
                      type="text"
                      className="postal-input"
                      placeholder="우편번호가 들어갑니다"
                    />
                    <button type="button" className="search-btn">
                      {/* <img src={magnifierIcon} alt="돋보기" className="magnifier-icon" /> */}
                      우편번호 찾기
                    </button>
                  </div>
                  <input type="text" placeholder="주소가 들어갑니다" />
                  <input type="text" placeholder="상세 주소가 들어갑니다" />
                </div>
              </section>

              {/* (4) 계정 인증 여부 */}
              <section>
                <h3>계정 인증 여부</h3>
                <div className="linked-account-row">
                  <label>네이버</label>
                  <p>연동된 계정이 없습니다.</p>
                  <button type="button" className="unlink-btn">
                    연동 해지
                  </button>
                </div>
                <div className="linked-account-row">
                  <label>카카오</label>
                  <p>연동된 계정이 없습니다.</p>
                  <button type="button" className="unlink-btn">
                    연동 해지
                  </button>
                </div>
                <div className="linked-account-row">
                  <label>구글</label>
                  <p>연동된 계정이 없습니다.</p>
                  <button type="button" className="unlink-btn">
                    연동 해지
                  </button>
                </div>
              </section>

              {/* (5) 마케팅 수신 동의 (선택) */}
              <section>
                <h3>마케팅 수신동의 (선택)</h3>
                <div className="checkbox-group">
                  <label>
                    <input type="checkbox" />
                    이메일
                  </label>
                  <label>
                    <input type="checkbox" />
                    SMS
                  </label>
                  <label>
                    <input type="checkbox" />
                    DM
                  </label>
                </div>
              </section>

              {/* (6) 하단 버튼들 */}
              <div className="bottom-buttons">
                <button type="button" className="leave-btn">
                  회원탈퇴
                </button>
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  취소
                </button>
                <button type="submit" className="submit-btn">
                  수정
                </button>
              </div>
            </form>
          ) : (
            /* 비밀번호 변경 폼 */
            <form onSubmit={handleSubmit} className="info-form">
              <section>
                <h3>비밀번호 변경</h3>
                <div className="form-group">
                  <label>현재 비밀번호</label>
                  <input type="password" placeholder="현재 비밀번호를 입력하세요" />
                </div>
                <div className="form-group">
                  <label>새 비밀번호</label>
                  <input type="password" placeholder="새 비밀번호" />
                </div>
                <div className="form-group">
                  <label>새 비밀번호 확인</label>
                  <input type="password" placeholder="새 비밀번호 확인" />
                </div>
              </section>

              <div className="bottom-buttons">
                <button type="button" onClick={handleCancel} className="cancel-btn">
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

      <Footer />
    </>
  );
}

export default MyInfoEdit;
