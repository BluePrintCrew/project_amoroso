import './MyPageReview.css';

import React, { useEffect, useState } from 'react';

import ErrorPopup from '../../components/ErrorPopup/ErrorPopup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function MyPageReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('MyPageReview useEffect 실행됨');
    
    // 이미 로딩 중이면 중복 실행 방지
    if (!loading) return;
    
    const fetchReviewableProducts = async () => {
      console.log('fetchReviewableProducts 함수 시작');
      try {
        const token = localStorage.getItem('access_token');
        console.log('토큰 확인:', token ? '토큰 있음' : '토큰 없음');

        if (!token) {
          console.log('토큰이 없어서 early return');
          setError('로그인이 필요합니다');
          setErrorMsg('로그인이 필요합니다. 로그인 후 다시 시도해 주세요.');
          setShowError(true);
          setLoading(false);
          return;
        }

        // 리뷰 작성 가능한 상품 목록 가져오기 (JWT 토큰으로 사용자 식별)
        console.log('reviewable-items API 호출 시작');
        const reviewableResponse = await axios.get(
          `${API_BASE_URL}/api/v1/orders/reviewable-items`,
          {
            params: {
              page: 0,
              size: 10,
              sort: 'createdAt,desc'
            },
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('reviewable-items 응답:', reviewableResponse.data);

        // 이미 작성한 리뷰 목록 가져오기
        const writtenReviewsResponse = await axios.get(
          `${API_BASE_URL}/api/v1/reviews/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 리뷰 가능한 상품 목록 데이터 구성
        let reviewableProducts = [];

        if (
          reviewableResponse.data.content &&
          Array.isArray(reviewableResponse.data.content)
        ) {
          reviewableProducts = reviewableResponse.data.content.map(
            (product) => {
              return {
                productId: product.productId,
                productName: product.productName,
                purchaseDate: formatDate(product.orderDate),
                hasReview: false, // 리뷰 가능한 상품이므로 false
                mainImageUrl: product.mainImageUri,
              };
            }
          );
        }

        setReviews(reviewableProducts);
      } catch (error) {
        console.error('리뷰 데이터 로딩 오류:', error);
        console.error('에러 상세:', error.response?.status, error.response?.data);
        console.error('에러 메시지:', error.message);
        setError('리뷰 목록을 불러오는데 실패했습니다');
        setErrorMsg(
          error.response?.data?.message || '리뷰 목록을 불러오는데 실패했습니다'
        );
        setShowError(true);
      } finally {
        console.log('finally 블록 실행');
        setLoading(false);
      }
    };

    fetchReviewableProducts();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}.${String(date.getDate()).padStart(2, '0')} ${String(
        date.getHours()
      ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch (e) {
      console.error('날짜 포맷팅 오류:', e);
      return dateString;
    }
  };

  // 리뷰 작성 페이지로 이동
  const handleWriteReview = (productId) => {
    // navigate(`/write-review/${productId}`);
    setShowComingSoonModal(true);
  };

  // 작성한 리뷰 보기
  const handleViewReview = (productId) => {
    navigate(`/my-reviews/${productId}`);
  };

  // 팝업 닫기 시 새로고침
  const handleClosePopup = () => {
    setShowError(false);
    setError(null); // 에러 상태 초기화
    setErrorMsg(''); // 에러 메시지 초기화
    if (errorMsg.includes('로그인')) {
      navigate('/login');
    }
    // window.location.reload() 제거 - 무한 루프 방지
  };

  if (loading) {
    return (
      <div className="my-page-review-container loading">
        <h2 className="review-title">리뷰 작성 &gt;</h2>
        <p>리뷰 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <ErrorPopup message={errorMsg} onClose={handleClosePopup} />
        <div
          className="my-page-review-container empty"
          style={{ minHeight: 200 }}
        />
      </>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="my-page-review-container empty">
        <h2 className="review-title">리뷰 작성 &gt;</h2>
        <div className="empty-message" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <div>작성 가능한 리뷰가 없습니다.</div>
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
              cursor: 'pointer',
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
      <h2 className="review-title">리뷰 작성 &gt;</h2>
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
                      src={
                        item.mainImageUrl.startsWith('http')
                          ? item.mainImageUrl
                          : `${API_BASE_URL}/api/v1/images/${item.mainImageUrl
                              .split('/')
                              .pop()}`
                      }
                      alt={item.productName}
                      className="product-thumbnail"
                      onError={(e) =>
                        (e.target.src =
                          'https://placehold.co/50x50?text=No+Image')
                      }
                    />
                  )}
                  <span className="product-name">{item.productName}</span>
                </div>
              </td>
              <td>{item.purchaseDate}</td>
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

      {/* 기능 준비중 모달 */}
      {showComingSoonModal && (
        <div 
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowComingSoonModal(false)}
        >
          <div 
            className="modal-content"
            style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              textAlign: 'center',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              기능 준비중입니다
            </h3>
            <p style={{ margin: '0 0 24px 0', color: '#666', fontSize: '14px' }}>
              리뷰 작성 기능을 준비중입니다.<br />
              빠른 시일 내에 제공할 예정입니다.
            </p>
            <button
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#766e68',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onClick={() => setShowComingSoonModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPageReview;
