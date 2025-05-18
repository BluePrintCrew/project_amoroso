import PageLayout from "../../components/PageLayout/PageLayout";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import axios from "axios";
import { API_BASE_URL } from "../MyPage/api";
import { useNavigate } from "react-router-dom";

const SellerLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/seller/login`, {
        email,
        password,
      });
      alert("로그인 성공!");
      // TODO: 토큰 저장 후 리디렉션 등
    } catch (err) {
      alert("로그인 실패: " + (err.response?.data?.message || "서버 오류"));
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>판매자 로그인</h1>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            이메일
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className={styles.formInput}
          />
        </div>
        <button type="submit" className={styles.loginButton}>
          로그인
        </button>
        <div className={styles.loginLinks}>
          <button className={styles.linkButton}>아이디/비밀번호 찾기</button>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => navigate("/admin/signup")}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerLoginForm;
