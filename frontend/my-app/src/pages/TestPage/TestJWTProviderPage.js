import React from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

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

            // 메시지 표시 (있는 경우)
            const message = data.message || `${role} 계정 JWT가 발급되었습니다.`;
            alert(message);

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

            <div style={{ marginBottom: "30px" }}>
                <h3>기본 계정</h3>
                <button
                    onClick={() => handleTokenRequest("USER")}
                    style={{
                        margin: "10px",
                        padding: "15px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    User 계정 JWT 발급
                </button>
                <button
                    onClick={() => handleTokenRequest("ADMIN")}
                    style={{
                        margin: "10px",
                        padding: "15px 20px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Admin 계정 JWT 발급
                </button>
            </div>

            <div style={{ marginBottom: "30px" }}>
                <h3>판매자 계정</h3>
                <button
                    onClick={() => handleTokenRequest("SELLER")}
                    style={{
                        margin: "10px",
                        padding: "15px 20px",
                        backgroundColor: "#ffc107",
                        color: "black",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Seller 계정 JWT 발급<br/>
                    <small>(상품만 있음, 주문 실적 없음)</small>
                </button>
                <button
                    onClick={() => handleTokenRequest("SELLER_WITH_ORDERS")}
                    style={{
                        margin: "10px",
                        padding: "15px 20px",
                        backgroundColor: "#fd7e14",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Seller 계정 JWT 발급<br/>
                    <small>(상품 + 주문 실적 포함)</small>
                </button>
            </div>

            <div>
                <h3>계정 관리</h3>
                <button
                    onClick={handleResetUser}
                    style={{
                        margin: "10px",
                        padding: "15px 20px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    발급된 JWT 계정 삭제
                </button>
            </div>

            <div style={{ marginTop: "40px", fontSize: "14px", color: "#666" }}>
                <p>※ 모든 테스트 계정은 동일한 이메일(test@testEmail.com)을 사용합니다.</p>
                <p>※ 새로운 역할의 계정을 생성하면 기존 계정이 덮어쓰여집니다.</p>
            </div>
        </div>
    );
};

export default TestJWTProviderPage;