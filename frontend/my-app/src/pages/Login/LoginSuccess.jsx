import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // 로컬 스토리지에 토큰이 있는지 확인
      let token = localStorage.getItem('access_token');

      // 없으면 URL에서 토큰 가져오기
      if (!token) {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');

        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
          token = accessToken;
        } else {
          navigate("/loginFailure");
          return;
        }
      }

      // 토큰 디코드 및 역할 기반 라우팅
      const decoded = jwtDecode(token);
      if (decoded.role === "ROLE_SELLER") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login processing error:", err);
      navigate("/loginFailure");
    }
  }, [navigate]);

  return (
    <div>
      <h2>로그인 처리 중...</h2>
    </div>
  );
};

export default LoginSuccess;
