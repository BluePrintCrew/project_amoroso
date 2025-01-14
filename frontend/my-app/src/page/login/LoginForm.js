import React from "react";
import "./LoginForm.css";
import kakao from "../../assets/kakao_login.png";
import naver from "../../assets/naver_login.png";
import google from "../../assets/google_login.png";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const LoginForm = () => {
  return (
    <>
      <Header />
      <div className="login-container">
        <h1 className="login-title">회원 로그인</h1>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              아이디
            </label>
            <input
              type="text"
              id="email"
              placeholder="이메일 또는 아이디"
              className="form-input"
            />
          </div>
          <div className="from-group">
            <label htmlFor="password" className="form-label">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              className="form-input"
            />
          </div>
          <div className="form-group checkbox-group">
            <div className="checkbox-wrapper">
              <input type="checkbox" id="save-id" className="checkbox-input" />
              <label htmlFor="save-id" className="checkbox-label">
                아이디 저장
              </label>
            </div>
          </div>
          <p className="checkbox-note">
            (개인정보 보호를 위해 개인 PC에서만 이용해주세요)
          </p>

          <button type="submit" className="login-button">
            로그인
          </button>

          <div className="social-login">
            <p className="social-login-title">간편 로그인</p>
            <div className="social-login-buttons">
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8080/oauth2/authorize/kakao")
                }
                className="social-button kakao"
              >
                <img src={kakao} alt="카카오 로그인" />
              </button>
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8080/oauth2/authorize/naver")
                }
                className="social-button naver"
              >
                <img src={naver} alt="네이버 로그인" />
              </button>
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8080/oauth2/authorize/google")
                }
                className="social-button google"
              >
                <img src={google} alt="구글 로그인" />
              </button>
            </div>
          </div>

          <div className="login-links">
            <button className="link-button">아이디/비밀번호 찾기</button>
            <button className="link-button">회원가입</button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default LoginForm;
