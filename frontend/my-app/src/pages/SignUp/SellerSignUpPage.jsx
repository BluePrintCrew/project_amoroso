import React, { use, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";
import PageLayout from "../../components/PageLayout/PageLayout";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const SellerSignUpPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [ceoName, setCeoName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleFindZipcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      const script = document.createElement("script");
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.onload = () => openPostcode();
      document.head.appendChild(script);
    } else {
      openPostcode();
    }
  };

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setZipcode(data.zonecode);
        setAddress(data.address);
        document.getElementById("detailAddress").focus();
      },
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms || !agreePrivacy) {
      alert("약관에 동의해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const requestData = {
        email,
        password,
        name: ceoName,
        phoneNumber,
        emailConsent: true,
        smsConsent: true,
        dmConsent: true,
        locationConsent: true,
        brandName: companyName,
        businessNumber,
        businessStartDate: new Date().toISOString().slice(0, 10),
        businessAddress: address,
        businessDetailAddress: detailAddress,
        businessTel: phoneNumber,
        businessEmail: email,
      };

      await axios.post(`${API_BASE_URL}/api/v1/sellers/register`, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("판매자 회원가입이 완료되었습니다.");
      navigate("/admin/login");
    } catch (err) {
      console.error("회원가입 실패:", err);
      setError("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBusinessNumber = async () => {
    if (!businessNumber || businessNumber.length !== 10) {
      alert("10자리의 사업자등록번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/business/status/${businessNumber}`
      );

      const result = response?.data;

      console.log("✅ API 응답:", result);

      if (result?.businessStatus === "계속사업자") {
        setIsVerified(true);
        alert("정상 사업자로 인증되었습니다.");

        await fetchSalesRegistrationInfo();
      } else {
        setIsVerified(false);
        alert("유효하지 않은 사업자등록번호입니다.");
      }
    } catch (err) {
      console.error("사업자 인증 오류:", err);
      alert("사업자 인증 중 오류가 발생했습니다.");
    }
  };

  const fetchSalesRegistrationInfo = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/sellers/validate-ecommerce`,
        {
          businessNumber,
          brandName: companyName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response?.data;

      console.log("📦 validate-ecommerce 응답:", result);

      if (result?.valid && result?.registrationNumber) {
        setRegistrationNumber(result.registrationNumber);
      } else {
        setRegistrationNumber("조회 실패");
        alert("통신판매업신고번호를 조회할 수 없습니다.");
      }
    } catch (err) {
      console.error("❌ 통신판매업신고번호 조회 오류:", err);
      alert("통신판매업신고번호 조회 중 오류가 발생했습니다.");
    }
  };

  function formatPhoneNumber(phone) {
    if (phone.length === 11) {
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (phone.length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    return phone;
  }

  const handleSendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.length !== 11) {
      alert("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/v1/phone-verification/send`, {
        phoneNumber: formatPhoneNumber(phoneNumber),
      });

      alert("인증번호가 전송되었습니다.");
      setIsCodeSent(true); // 인증번호 입력칸 활성화
    } catch (error) {
      console.error("휴대폰 인증번호 전송 실패:", error);
      alert("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/phone-verification/verify`,
        {
          phoneNumber,
          verificationCode: verificationCodeInput,
        }
      );

      alert("휴대폰 인증이 완료되었습니다.");
      setIsPhoneVerified(true);
    } catch (error) {
      console.error("인증번호 확인 실패:", error);
      alert("인증번호가 올바르지 않거나 유효 시간이 지났습니다.");
    }
  };

  return (
    <div>
      <PageLayout>
        <div className="signup-container">
          <h1 className="signup-title">판매자 회원가입</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>비밀번호 확인</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>

            <div className="business-verification-box">
              <div className="input-group">
                <label>사업자등록번호</label>
                <input
                  type="text"
                  value={businessNumber}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setBusinessNumber(onlyNums);
                  }}
                  required
                  maxLength={10}
                  placeholder=" '-' 없이 작성하세요"
                  readOnly={isVerified}
                />
              </div>

              <div className="certification-group">
                <label>상호명(브랜드명)</label>
                <div>
                  <input
                    type="text"
                    value={companyName}
                    className="business-number-input"
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyBusinessNumber}
                    className="certification-button"
                    disabled={isVerified}
                  >
                    인증
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>통신판매업신고번호</label>
                <input
                  type="text"
                  value={registrationNumber || ""}
                  readOnly
                  placeholder="인증 시 자동조회됩니다."
                />
              </div>
            </div>

            <div className="input-group">
              <label>대표자명</label>
              <input
                type="text"
                value={ceoName}
                onChange={(e) => setCeoName(e.target.value)}
                required
              />
            </div>

            <div className="certification-group">
              <label>휴대폰 번호</label>
              <div>
                <input
                  type="text"
                  value={phoneNumber}
                  className="business-number-input"
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setPhoneNumber(onlyNums);
                  }}
                  required
                  maxLength={11}
                  placeholder=" '-' 없이 작성하세요"
                  readOnly={isPhoneVerified}
                />
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  className="certification-button"
                  style={{ flex: "3" }}
                  disabled={isCodeSent}
                >
                  인증번호 전송
                </button>
              </div>
            </div>

            {isCodeSent && (
              <div className="certification-group">
                <label>인증번호 입력</label>
                <div>
                  <input
                    type="text"
                    value={verificationCodeInput}
                    onChange={(e) => setVerificationCodeInput(e.target.value)}
                    className="business-number-input"
                    placeholder="인증번호 입력"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    className="certification-button"
                    onClick={handleVerifyCode}
                  >
                    확인
                  </button>
                </div>
              </div>
            )}

            <div className="input-group">
              <label>사업장 전화번호</label>
              <input
                type="text"
                value={companyPhoneNumber}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setCompanyPhoneNumber(onlyNums);
                }}
                required
                maxLength={11}
                placeholder=" '-' 없이 작성하세요"
              />
            </div>

            <div className="address-group">
              <label>사업장 주소</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  className="zipcode"
                  placeholder="우편번호"
                  value={zipcode}
                  readOnly
                  required
                  style={{ flex: "2.5" }}
                />
                <button
                  type="button"
                  className="certification-button"
                  onClick={handleFindZipcode}
                >
                  우편번호 찾기
                </button>
              </div>
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="주소"
                value={address}
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

            <div className="input-group">
              <label>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                이용약관 동의 (필수)
              </label>
            </div>

            <div className="input-group">
              <label>
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                />
                개인정보 처리방침 동의 (필수)
              </label>
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "가입 처리 중..." : "가입 완료"}
              </button>
            </div>
          </form>
        </div>
      </PageLayout>
    </div>
  );
};

export default SellerSignUpPage;
