import PageLayout from "../../components/PageLayout/PageLayout";
import React from "react";
import google from "../../assets/google_login.png";
import kakao from "../../assets/kakao_login.png";
import naver from "../../assets/naver_login.png";
import styles from "./LoginForm.module.css";
import { API_BASE_URL } from "../MyPage/api";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>회원 로그인</h1>
        <form className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              아이디
            </label>
            <input
              type="text"
              id="email"
              placeholder="이메일 또는 아이디"
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              className={styles.formInput}
            />
          </div>
          <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id="save-id"
                className={styles.checkboxInput}
              />
              <label htmlFor="save-id" className={styles.checkboxLabel}>
                아이디 저장
              </label>
            </div>
          </div>
          <p className={styles.checkboxNote}>
            (개인정보 보호를 위해 개인 PC에서만 이용해주세요)
          </p>

          <button type="submit" className={styles.loginButton}>
            로그인
          </button>

          <div className={styles.socialLogin}>
            <p className={styles.socialLoginTitle}>간편 로그인</p>
            <div className={styles.socialLoginButtons}>
              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`)
                }
                className={`${styles.socialButton} ${styles.kakao}`}
              >
                <img src={kakao} alt="카카오 로그인" />
              </button>
              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${API_BASE_URL}/oauth2/authorization/naver`)
                }
                className={`${styles.socialButton} ${styles.naver}`}
              >
                <img src={naver} alt="네이버 로그인" />
              </button>
              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${API_BASE_URL}/oauth2/authorization/google`)
                }
                className={`${styles.socialButton} ${styles.google}`}
              >
                <img src={google} alt="구글 로그인" />
              </button>
            </div>
          </div>

          <div className={styles.loginLinks}>
            <button className={styles.linkButton}>아이디/비밀번호 찾기</button>
            <button
              className={styles.linkButton}
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default LoginForm;
