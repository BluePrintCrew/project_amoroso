import React from 'react';
import kakaoButton from '../../assets/kakao_button.png';
import logo from '../../assets/logo.png';
import styles from './Footer.module.css';

const Footer = () => {
  const handleClick = () => {
    alert('카카오톡 상담버튼 클릭.');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerLinks}>
          <div>
            <a href="/about" className={styles.footerLink}>
              회사소개
            </a>
          </div>
          <div>
            <a href="/terms" className={styles.footerLink}>
              이용약관
            </a>
          </div>
          <div>
            <a href="/privacy" className={styles.footerLink}>
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footerBorder}></div>

      <div className={styles.footerContent}>
        <div className={styles.footerInfo}>
          <img src={logo} alt="Logo" className={styles.footerLogo} />
          <h4 className={styles.footerInfo1}>고객센터 이용안내</h4>
          <p className={styles.footerInfo2}>
            평일 09:00 ~ 18:00, 토요일 09:00 ~ 13:00
            <br />
            (일요일, 공휴일 휴무)
          </p>
        </div>
        <div className={styles.footerInquiry}>
          <h4 className={styles.footerInquiry1}>문의하기</h4>
          <p className={styles.footerInquiry2}>
            상품, 배송, 사이트 이용문의 (1234-5678)
          </p>
          <img
            src={kakaoButton}
            alt="Kakao Button"
            className={styles.kakaoButton}
            onClick={handleClick}
          />
        </div>
        <div className={styles.footerService}>
          <h4 className={styles.footerService1}>A/S 문의</h4>
          <p className={styles.footerService2}>
            A/S 신청 및 추가부품 문의 (1234-5678)
          </p>
          <img
            src={kakaoButton}
            alt="Kakao Button"
            className={styles.kakaoButton}
            onClick={handleClick}
          />
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>
          (주) Amoroso 대표: 손영현 서울특별시 강남구 마루길 123 |
          사업자등록번호 123-45-6789 통신판매업신고 : 0000-서울서울-0000
        </p>
      </div>
    </footer>
  );
};

export default Footer;
