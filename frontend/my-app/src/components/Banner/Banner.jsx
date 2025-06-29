import React, { useState, useEffect } from 'react';
import leftArrow from '../../assets/left_arrow.png';
import rightArrow from '../../assets/right_arrow.png';
import styles from './Banner.module.css';

// 이미지들을 배열로 관리
const covers = [
  require('../../assets/mainpage/cover1.jpg'),
  require('../../assets/mainpage/cover2.jpg'),
  require('../../assets/mainpage/cover3.jpg'),
  require('../../assets/mainpage/cover4.jpg'),
  require('../../assets/mainpage/cover5.jpg'),
  require('../../assets/mainpage/cover6.jpg'),

  require('../../assets/mainpage/cover8.jpg'),
  require('../../assets/mainpage/cover9.jpg'),
  require('../../assets/mainpage/cover10.jpg'),


];

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false);

  // 이미지 사전 로딩
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = covers.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('이미지 로딩 실패:', error);
        setImagesLoaded(true); // 에러가 있어도 계속 진행
      }
    };

    preloadImages();
  }, []);

  // 현재 이미지 로딩 상태 관리
  useEffect(() => {
    setCurrentImageLoaded(false);
    const img = new Image();
    img.onload = () => setCurrentImageLoaded(true);
    img.src = covers[currentIndex];
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + covers.length) % covers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % covers.length);
  };

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.bannerContainer}>
      {!imagesLoaded && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <p>이미지를 불러오는 중...</p>
        </div>
      )}
      
      <div
        className={`${styles.banner} ${currentImageLoaded ? styles.loaded : ''}`}
        style={{ backgroundImage: `url(${covers[currentIndex]})` }}
      >
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContentWrapper}>
          <button
            className={`${styles.arrowButton} ${styles.left}`}
            onClick={handlePrev}
            aria-label="이전 이미지"
          >
            <img src={leftArrow} alt="Left" />
          </button>

          <div className={styles.bannerContent}>
            <h1>당신의 일상을</h1>
            <h1>이탈리아 품격으로</h1>
            <p>이태리 가구 최대 30% 할인</p>
          </div>

          <button
            className={`${styles.arrowButton} ${styles.right}`}
            onClick={handleNext}
            aria-label="다음 이미지"
          >
            <img src={rightArrow} alt="Right" />
          </button>
        </div>
      </div>

      {/* 인디케이터 */}
      <div className={styles.indicators}>
        {covers.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`${index + 1}번째 이미지로 이동`}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;
