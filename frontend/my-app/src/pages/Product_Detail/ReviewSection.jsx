import React, { useState, useEffect } from 'react';
import styles from './ReviewSection.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('전체');
  const [selectedFilter, setSelectedFilter] = useState('베스트순');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // 페이지 크기를 10으로 설정한 예시입니다. 필요에 따라 조정하세요.
        const response = await fetch(
          `${API_BASE_URL}/api/v1/reviews/product/${productId}?page=0&size=10`, 
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('리뷰를 불러오는데 실패했습니다');
        }

        const data = await response.json();
        console.log('API 응답 리뷰 데이터:', data);
        
        // API 응답 구조에 따라 여기를 조정하세요. 이 예시에서는 data.content가 리뷰 배열이라고 가정합니다.
        setReviews(data.content || []);
      } catch (error) {
        console.error('리뷰 가져오기 오류:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId, selectedFilter]);

  // 필터링된 리뷰 계산
  const filteredReviews = filter === '사진'
    ? reviews.filter((review) => review.imageUrls && review.imageUrls.length > 0)
    : reviews;

  // 모든 리뷰 이미지 모으기
  const allImages = reviews.flatMap(review => review.imageUrls || []);
  
  // 평균 평점 계산
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };
  
  const averageRating = calculateAverageRating();
  
  const filterOptions = ['베스트순', '최신순', '평점 높은순', '평점 낮은순'];

  if (loading) return <div className={styles.loading}>리뷰를 불러오는 중...</div>;
  if (error) return <div className={styles.error}>리뷰를 불러오는데 실패했습니다: {error}</div>;
  if (!reviews || reviews.length === 0) return <div className={styles.noReviews}>아직 등록된 리뷰가 없습니다.</div>;

  return (
    <div className={styles.reviewSection}>
      <div className={styles.reviewHeader}>
        <div className={styles.filterButtons}>
          <button
            onClick={() => setFilter('전체')}
            className={filter === '전체' ? styles.activeFilter : ''}
          >
            전체 ({reviews.length}건)
          </button>
          <button
            onClick={() => setFilter('사진')}
            className={filter === '사진' ? styles.activeFilter : ''}
          >
            사진 ({allImages.length}건)
          </button>
        </div>
      </div>

      {filter === '전체' ? (
        <>
          <div className={styles.topBox}>
            <div className={styles.reviewSummary}>
              <div className={styles.ratingBox}>
                <span className={styles.rating}>{averageRating}</span>
                <div className={styles.stars}>
                  {'★'.repeat(Math.floor(averageRating))}
                  {averageRating % 1 !== 0 && '⭑'}
                  {'☆'.repeat(5 - Math.ceil(averageRating))}
                </div>
              </div>
            </div>

            <div className={styles.imageGallery}>
              {filteredReviews
                .filter(review => review.imageUrls && review.imageUrls.length > 0)
                .slice(0, 5).map((review, index) => (
                <div key={index} className={styles.imageWrapper}>
                  <img
                    src={`${API_BASE_URL}/api/v1/review-images/file/${review.imageUrls[0].split('/').pop()}`}
                    alt={`리뷰 ${index + 1} 첫 번째 이미지`}
                    className={styles.galleryImage}
                  />
                  {review.imageUrls.length > 1 && (
                    <span className={styles.imageCountBadge}>
                      +{review.imageUrls.length - 1}
                    </span>
                  )}
                </div>
              ))}
              {allImages.length > 0 && (
                <div className={styles.imageWrapper}>
                  <div className={styles.moreImage}>
                    +<br />
                    사진 전체보기
                  </div>
                  <span className={styles.imageCount}>{allImages.length}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.dropdown}>
            <button
              className={styles.dropdownButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedFilter} ▼
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                {filterOptions.map((option) => (
                  <li
                    key={option}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.reviewList}>
            {filteredReviews.map((review) => (
              <div key={review.reviewId} className={styles.reviewItem}>
                {review.imageUrls && review.imageUrls.length > 0 && (
                  <img
                    src={`${API_BASE_URL}/api/v1/review-images/file/${review.imageUrls[0].split('/').pop()}`}
                    alt="리뷰 이미지"
                    className={styles.reviewImage}
                  />
                )}
                <div className={styles.reviewContent}>
                  <div className={styles.userInfo}>
                    <span className={styles.stars}>
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className={styles.user}>
                      {/* 사용자 이름 마스킹 처리 */}
                      {review.userName.substring(0, 2)}{'*'.repeat(Math.max(review.userName.length - 2, 3))}
                    </span>
                    <span className={styles.date}>
                      {/* 날짜 형식 변환 (ISO -> YYYY.MM.DD) */}
                      {new Date(review.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      }).replace(/\./g, '.').replace(/\s/g, '')}
                    </span>
                  </div>
                  <p className={styles.text}>{review.content}</p>
                  <button className={styles.helpfulButton}>도움돼요</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* 사진 탭 전용 UI */}
          <div className={styles.ratingTopBox}>
            <span className={styles.rating}>{averageRating}</span>
            <div className={styles.stars}>
              {'★'.repeat(Math.floor(averageRating))}
              {averageRating % 1 !== 0 && '⭑'}
              {'☆'.repeat(5 - Math.ceil(averageRating))}
            </div>
          </div>

          <div className={styles.photoGrid}>
            {filteredReviews
              .filter(review => review.imageUrls && review.imageUrls.length > 0)
              .map((review) => (
                <div key={review.reviewId} className={styles.photoCard}>
                  <div className={styles.photoWrapper}>
                    <img
                      src={`${API_BASE_URL}/api/v1/review-images/file/${review.imageUrls[0].split('/').pop()}`}
                      alt="리뷰 이미지"
                      className={styles.galleryImage}
                    />
                    {review.imageUrls.length > 1 && (
                      <span className={styles.imageCountBadge}>
                        {review.imageUrls.length}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewSection;