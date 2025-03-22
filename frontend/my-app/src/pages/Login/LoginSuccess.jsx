import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // 이미 localStorage에 토큰이 있으면 대시보드로 이동
      if (localStorage.getItem("accessToken")) {
        const token = localStorage.getItem("accessToken");
        const decoded = jwtDecode(token);
        console.log(decoded);
        navigateBasedOnRole(decoded.role);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        navigate("/dashboard");
      } else {
        // 액세스 토큰이 없는 경우 로그인 실패 페이지로 이동
        navigate("/loginFailure");
      }
    } catch (err) {
      setError("로그인 처리 중 오류가 발생했습니다.");
      console.error("Login processing error:", err);
    }
  }, [navigate]);

  const navigateBasedOnRole = (role) => {
    switch(role) {
      case "ROLE_SELLER":
        navigate("/admin");
        break;
      default:
        navigate("/");
    }
  }

  if (error) {
    return <div>error: {error}</div>;
  }

  return (
    <div>
      <h2>로그인 처리 중...</h2>
    </div>
  );
};

export default LoginSuccess;
