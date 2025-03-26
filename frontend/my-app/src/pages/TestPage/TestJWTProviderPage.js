import React from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../pages/MyPage/api";

const TestJWTProviderPage = () => {
    const navigate = useNavigate();

    const handleTokenRequest = async (role) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/Test-User/setup/${role}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch token");
            }

            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            alert(`${role} 계정 JWT가 발급되었습니다.`);
            navigate("/");
        } catch (error) {
            console.error("Error fetching token:", error);
            alert("토큰 발급 중 오류가 발생했습니다.");
        }
    };

    const handleResetUser = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/Test-User/reset`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            alert("테스트 계정이 삭제되었습니다.");
            localStorage.removeItem("access_token");
        } catch (error) {
            console.error("Error deleting test user:", error);
            alert("테스트 계정 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Test JWT Provider</h2>
            <button onClick={() => handleTokenRequest("USER")} style={{ margin: "10px", padding: "10px" }}>
                User 계정 JWT 발급 및 Home으로 이동
            </button>
            <button onClick={() => handleTokenRequest("ADMIN")} style={{ margin: "10px", padding: "10px" }}>
                Admin 계정 JWT 발급 및 Home으로 이동
            </button>
            <button onClick={() => handleTokenRequest("SELLER")} style={{ margin: "10px", padding: "10px" }}>
                Seller 계정 JWT 발급 및 Home으로 이동
            </button>
            <button onClick={handleResetUser} style={{ margin: "10px", padding: "10px", backgroundColor: "red", color: "white" }}>
                발급된 JWT 계정 삭제
            </button>
        </div>
    );
};

export default TestJWTProviderPage;
