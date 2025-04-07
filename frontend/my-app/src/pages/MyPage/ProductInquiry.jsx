import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductInquiry.css";
import kakaoIcon from "../../assets/kakao_icon.png";
import ProductQnADetail from "../../components/ProductQnA/ProductQnADetail";
import { API_BASE_URL } from "./api";

function ProductInquiry() {
  const [productInquiries, setProductInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // 모달창 관련 상태 추가
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  
  const navigate = useNavigate();

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
        // API 경로 수정
        const productResponse = await axios.get(`${API_BASE_URL}/api/v1/inquiries`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            page: currentPage,
            size: 10
          }
        });
        
        console.log("상품 문의 응답:", productResponse.data);
        
        // 페이지 정보 설정
        setTotalPages(productResponse.data.totalPages || 0);
        
        // 응답 형식에 맞게 수정
      // ProductInquiry.js 파일에서 데이터 매핑 부분 수정
const formattedProductInquiries = productResponse.data.content 
? productResponse.data.content.map(item => ({
    id: item.inquiryId,
    status: item.answered ? "답변완료" : "답변대기",
    title: item.inquiryTitle,  // title 속성 추가
    content: item.inquiryTitle,
    description: item.inquiryDescription,
    date: formatDate(item.createdAt),
    productId: item.productId,
    author: item.authorUsername,  // author 속성으로 통일
    authorUsername: item.authorUsername
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
  }, [currentPage]); // currentPage가 변경될 때마다 데이터를 다시 가져옴

  // 문의 클릭 핸들러 수정
  const handleInquiryClick = (item) => {
    // 상세 모달 표시
    setSelectedInquiry(item);
    setShowDetailModal(true);
    
    // 페이지 이동은 주석 처리 또는 제거
    // navigate(`/my-inquiries/product/${id}`);
  };

  // 모달 닫기 핸들러 추가
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedInquiry(null);
  };

  // 페이지 변경 처리 - 이 함수 정의 추가
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 카카오 상담 열기 - 이 함수 정의 추가
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
          <>
            <ul className="inquiry-list">
              {productInquiries.map((item, index) => (
                <li 
                  key={index} 
                  className="inquiry-item"
                  onClick={() => handleInquiryClick(item)}
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
            
            {/* 페이지네이션 컨트롤 */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 0}
                  className="pagination-button"
                >
                  이전
                </button>
                <span className="pagination-info">
                  {currentPage + 1} / {totalPages}
                </span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages - 1}
                  className="pagination-button"
                >
                  다음
                </button>
              </div>
            )}
          </>
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
      
      {/* 상세 모달창 추가 */}
      {showDetailModal && selectedInquiry && (
        <ProductQnADetail 
          onClose={handleCloseDetailModal} 
          inquiry={selectedInquiry}
        />
      )}
    </div>
  );
}

export default ProductInquiry;