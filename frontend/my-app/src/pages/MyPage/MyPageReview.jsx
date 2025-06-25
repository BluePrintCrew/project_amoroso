import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../../components/ErrorPopup/ErrorPopup";
import "./MyPageReview.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function MyPageReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewableProducts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setError("로그인이 필요합니다");
          setErrorMsg("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
          setShowError(true);
          setLoading(false);
          return;
        }

        // 현재 사용자 ID 가져오기
        const userResponse = await axios.get(`${API_BASE_URL}/api/v1/auth/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userId = userResponse.data.id || userResponse.data.userId;
        
        if (!userId) {
          setReviews([]); // 빈 상태로 처리
          setLoading(false);
          return;
        }

        // 리뷰 작성 가능한 상품 목록 가져오기
        const reviewableResponse = await axios.get(`${API_BASE_URL}/api/v1/orders/reviewable-items`, {
          params: {
            userId: userId,
            pageable: {
              page: 0,
              size: 10,
              sort: ["orderDate,desc"]
            }
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // 이미 작성한 리뷰 목록 가져오기
        const writtenReviewsResponse = await axios.get(`${API_BASE_URL}/api/v1/reviews/my`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // 리뷰 가능한 상품 목록과 이미 작성한 리뷰를 결합하여 데이터 구성
        let reviewableProducts = [];
        
        if (reviewableResponse.data.content && Array.isArray(reviewableResponse.data.content)) {
          reviewableProducts = reviewableResponse.data.content.map(product => {
            // 이미 작성한 리뷰가 있는지 확인
            const hasReview = !product.reviewable;
            
            return {
              productId: product.productId,
              productName: product.productName,
              purchaseDate: formatDate(product.orderDate),
              hasReview: hasReview,
              mainImageUrl: product.mainImageUri
            };
          });
        }

        setReviews(reviewableProducts);
      } catch (error) {
        console.error("리뷰 데이터 로딩 오류:", error);
        setError("리뷰 목록을 불러오는데 실패했습니다");
        setErrorMsg(error.response?.data?.message || "리뷰 목록을 불러오는데 실패했습니다");
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewableProducts();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch (e) {
      console.error("날짜 포맷팅 오류:", e);
      return dateString;
    }
  };

  // 리뷰 작성 페이지로 이동
  const handleWriteReview = (productId) => {
    navigate(`/write-review/${productId}`);
  };

  // 작성한 리뷰 보기
  const handleViewReview = (productId) => {
    navigate(`/my-reviews/${productId}`);
  };

  // 팝업 닫기 시 새로고침
  const handleClosePopup = () => {
    setShowError(false);
    if (errorMsg.includes("로그인")) {
      navigate('/login');
    } else {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="my-page-review-container loading">
        <h2 className="review-title">작성 가능한 후기 &gt;</h2>
        <p>리뷰 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <ErrorPopup
          message={errorMsg}
          onClose={handleClosePopup}
        />
        <div className="my-page-review-container empty" style={{ minHeight: 200 }} />
      </>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="my-page-review-container empty">
        <h2 className="review-title">작성 가능한 후기 &gt;</h2>
        <div className="empty-message" style={{textAlign:'center'}}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <div>작성 가능한 후기가 없습니다.</div>
          <button
            className="go-products-btn"
            onClick={() => navigate('/products')}
            style={{
              marginTop: 24,
              padding: '10px 24px',
              borderRadius: 8,
              border: 'none',
              background: '#766e68',
              color: '#fff',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            상품 보러가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-page-review-container">
      <h2 className="review-title">
        작성 가능한 후기 &gt;
      </h2>
      <table className="review-table">
        <thead>
          <tr>
            <th>상품명</th>
            <th>구매/상담일</th>
            <th>후기 작성</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((item, idx) => (
            <tr key={idx}>
              <td>
                <div className="product-info">
                  {item.mainImageUrl && (
                    <img 
                      src={item.mainImageUrl.startsWith('http') 
                        ? item.mainImageUrl 
                        : `${API_BASE_URL}/api/v1/images/${item.mainImageUrl.split('/').pop()}`} 
                      alt={item.productName} 
                      className="product-thumbnail"
                      onError={(e) => e.target.src = "https://placehold.co/50x50?text=No+Image"}
                    />
                  )}
                  <span className="product-name">{item.productName}</span>
                </div>
              </td>
              <td>
                {item.purchaseDate}
              </td>
              <td>
                {item.hasReview ? (
                  <button 
                    className="review-btn disabled"
                    onClick={() => handleViewReview(item.productId)}
                  >
                    작성한 후기 보기
                  </button>
                ) : (
                  <button 
                    className="review-btn"
                    onClick={() => handleWriteReview(item.productId)}
                  >
                    후기 작성하기
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyPageReview;