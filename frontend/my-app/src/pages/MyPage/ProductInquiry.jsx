import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductInquiry.css";
import kakaoIcon from "../../assets/kakao_icon.png"; // 필요한 경우 kakao 아이콘 이미지 임포트
import { API_BASE_URL } from "./api";

function ProductInquiry() {
  const [productInquiries, setProductInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // 상품 문의 데이터 가져오기
    const fetchInquiries = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError("로그인이 필요합니다");
        setLoading(false);
        return;
      }

      // 상품 문의 가져오기
      try {
        // API 경로는 백엔드에 맞게 조정 필요
        const productResponse = await axios.get(`${API_BASE_URL}/api/v1/inquiries/product`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("상품 문의 응답:", productResponse.data);
        
        // 상품 문의 데이터 변환
        const formattedProductInquiries = Array.isArray(productResponse.data) 
          ? productResponse.data.map(item => ({
              id: item.id || item.inquiryId,
              status: item.answered ? "답변완료" : "답변대기",
              content: item.content || item.message || "",
              date: formatDate(item.createdAt || item.createDate),
              productId: item.productId,
              productName: item.productName || "",
              // 기타 필요한 데이터
            }))
          : [];
        
        setProductInquiries(formattedProductInquiries);
      } catch (err) {
        console.error("상품 문의 로딩 오류:", err);
        setError("상품 문의를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    } catch (e) {
      console.error("날짜 포맷팅 오류:", e);
      return dateString;
    }
  };

  // 문의 상세 페이지로 이동
  const handleInquiryClick = (id) => {
    navigate(`/my-inquiries/product/${id}`);
  };

  // 카카오 상담 열기
  const handleKakaoChat = () => {
    // 실제 카카오 채널 URL로 대체 필요
    window.open('https://pf.kakao.com/_계정이름/chat', '_blank');
  };

  if (loading) {
    return (
      <div className="product-inquiry-container">
        <div className="inquiry-section loading">
          <h2 className="inquiry-title">상품 문의 &gt;</h2>
          <p>문의 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-inquiry-container">
        <div className="inquiry-section error">
          <h2 className="inquiry-title">상품 문의 &gt;</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-inquiry-container">
      <div className="inquiry-section">
        <h2 className="inquiry-title">
          상품 문의 &gt;
        </h2>
        {productInquiries.length === 0 ? (
          <p className="empty-message">문의 내역이 없습니다</p>
        ) : (
          <ul className="inquiry-list">
            {productInquiries.map((item, index) => (
              <li 
                key={index} 
                className="inquiry-item"
                onClick={() => handleInquiryClick(item.id)}
              >
                {/* Status badge */}
                <span
                  className={
                    item.status === "답변완료" ? "badge complete" : "badge pending"
                  }
                >
                  {item.status}
                </span>
                {/* Inquiry content */}
                <span className="inquiry-content">
                  {item.content}
                </span>
                {/* Date */}
                <span className="inquiry-date">
                  {item.date}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Note + 카톡상담하기 button */}
      <div className="inquiry-footer">
        <p className="inquiry-note">
          • 주문, AS 및 반품관련 문의는 간편하게 카톡상담을 이용해 주세요.
        </p>
        <button className="kakao-button" onClick={handleKakaoChat}>
          <span className="kakao-icon">💬</span> 카톡상담하기
        </button>
      </div>
    </div>
  );
}

export default ProductInquiry;