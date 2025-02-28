import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      navigate("/dashboard");
    } else {
      navigate("/loginFailure");
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default LoginSuccess;
