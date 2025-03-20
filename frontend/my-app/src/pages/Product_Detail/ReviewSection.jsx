import React, { useState } from 'react';

import styles from './ReviewSection.module.css';

const reviews = [
  {
    id: 1,
    user: 'ha******',
    rating: 5,
    date: '2025.01.23',
    text: '디자인 깔끔합니다. 곡선도 모나지 않고 수납 서랍도 튼튼합니다. 매트리스 단단한 느낌이지만 편안합니다.',
    images: ['https://placehold.co/150', 'https://placehold.co/150'],
  },
  {
    id: 2,
    user: 'ba*******',
    rating: 3,
    date: '2025.01.22',
    text: '방이 작아서 서랍장을 놓을 공간이 없어서 수납침대로 구입했습니다. 생각보다 너무 만족합니다.',
    images: ['https://placehold.co/150'],
  },
];

const averageRating = (
  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
).toFixed(1);

const ReviewSection = () => {
  const [filter, setFilter] = useState('전체');
  const [selectedFilter, setSelectedFilter] = useState('베스트순');
  const [isDropdownOpen, SetIsDropdownOpen] = useState(false);

  const filterOptions = ['베스트순', '최신순', '평점 높은순', '평점 낮은순'];
  const allImages = reviews.flatMap((review) => review.images);

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
          {allImages.slice(0, 5).map((img, index) => (
            <div key={index} className={styles.imageWrapper}>
              <img
                src={img}
                alt={`리뷰 이미지 ${index}`}
                className={styles.galleryImage}
              />
            </div>
          ))}
          <div className={styles.imageWrapper}>
            <div className={styles.moreImage}>
              +<br />
              사진 전체보기
            </div>
            <span className={styles.imageCount}>{allImages.length}</span>
          </div>
        </div>
      </div>

      <div className={styles.dropdown}>
        <button
          className={styles.dropdownButton}
          onClick={() => SetIsDropdownOpen(!isDropdownOpen)}
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
                  SetIsDropdownOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.reviewList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            {review.images.length > 0 && (
              <img
                src={review.images[0]}
                alt="리뷰 이미지"
                className={styles.reviewImage}
              />
            )}
            <div className={styles.reviewContent}>
              <div className={styles.userInfo}>
                <span className={styles.stars}>★★★★★</span>
                <span className={styles.user}>{review.user}</span>
                <span className={styles.date}>{review.date}</span>
              </div>
              <p className={styles.text}>{review.text}</p>
              <button className={styles.helpfulButton}>도움돼요</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
