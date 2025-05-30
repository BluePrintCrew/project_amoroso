import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyPageReview.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function MyPageReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewableProducts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setError("로그인이 필요합니다");
          setLoading(false);
          return;
        }

        // 현재 사용자 ID 가져오기
        const userResponse = await axios.get(`${API_BASE_URL}/api/v1/auth/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // 로그를 통해 응답 확인
        console.log("사용자 정보 응답:", userResponse.data);
        
        const userId = userResponse.data.id || userResponse.data.userId;
        
        if (!userId) {
          setError("사용자 ID를 찾을 수 없습니다");
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

        console.log("리뷰 작성 가능 상품 응답:", reviewableResponse.data);

        // 이미 작성한 리뷰 목록 가져오기
        const writtenReviewsResponse = await axios.get(`${API_BASE_URL}/api/v1/reviews/my`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("작성한 리뷰 응답:", writtenReviewsResponse.data);

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
      <div className="my-page-review-container error">
        <h2 className="review-title">작성 가능한 후기 &gt;</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="my-page-review-container empty">
        <h2 className="review-title">작성 가능한 후기 &gt;</h2>
        <p className="empty-message">작성 가능한 후기가 없습니다.</p>
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