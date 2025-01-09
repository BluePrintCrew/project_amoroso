import React from "react";
import logo from "../../assets/logo.png";
import kakaoButton from "../../assets/kakao_button.png";
import "./Footer.css";

const Footer = () => {
  const handleClick = () => {
    alert("카카오톡 상담버튼 클릭.");
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-links">
          <div>
            <a href="/about" className="footer-link">
              회사소개
            </a>
          </div>
          <div>
            <a href="/terms" className="footer-link">
              이용약관
            </a>
          </div>
          <div>
            <a href="/privacy" className="footer-link">
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
      <hr />
      <div className="footer-content">
        <div className="footer-info">
          <img src={logo} alt="Logo" className="footer-logo" />
          <h4 className="footer-info-1">고객센터 이용안내</h4>
          <p className="footer-info-2">
            평일 09:00 ~ 18:00, 토요일 09:00 ~ 13:00
            <br />
            (일요일, 공휴일 휴무)
          </p>
        </div>
        <div className="footer-inquiry">
          <h4 className="footer-inquiry-1">문의하기</h4>
          <p className="footer-inquiry-2">
            상품, 배송, 사이트 이용문의 (1234-5678)
          </p>
          <img
            src={kakaoButton}
            alt="Kakao Button"
            className="kakao-button"
            onClick={handleClick}
          />
        </div>
        <div className="footer-service">
          <h4 className="footer-service-1">A/S 문의</h4>
          <p className="footer-service-2">
            A/S 신청 및 추가부품 문의 (1234-5678)
          </p>
          <img
            src={kakaoButton}
            alt="Kakao Button"
            className="kakao-button"
            onClick={handleClick}
          />
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          (주) Amoroso 대표: 손영현 서울특별시 강남구 마루길 123 |
          사업자등록번호 123-45-6789 통신판매업신고 : 0000-서울서울-0000
        </p>
      </div>
    </footer>
  );
};

export default Footer;
