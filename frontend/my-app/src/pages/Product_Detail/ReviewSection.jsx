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
    rating: 5,
    date: '2025.01.22',
    text: '방이 작아서 서랍장을 놓을 공간이 없어서 수납침대로 구입했습니다. 생각보다 너무 만족합니다.',
    images: ['https://placehold.co/150'],
  },
];

const ReviewSection = () => {
  const [filter, setFilter] = useState('전체');

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
        <div className={styles.ratingBox}>
          <span className={styles.rating}>4.8</span>
          <div className={styles.stars}>★★★★★</div>
        </div>
      </div>

      <div className={styles.imageGallery}>
        {reviews
          .flatMap((r) => r.images)
          .slice(0, 6)
          .map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`리뷰 이미지 ${index}`}
              className={styles.galleryImage}
            />
          ))}
        <div className={styles.moreImages}>사진 전체보기</div>
      </div>

      <div className={styles.filterBox}>
        <button
          onClick={() => setFilter('사진 모아보기')}
          className={filter === '사진 모아보기' ? styles.active : ''}
        >
          사진 모아보기
        </button>
        <button
          onClick={() => setFilter('베스트순')}
          className={filter === '베스트순' ? styles.active : ''}
        >
          베스트순
        </button>
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
