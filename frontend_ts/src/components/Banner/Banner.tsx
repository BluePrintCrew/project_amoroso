import { useCallback, useEffect, useRef, useState } from 'react';

import leftArrow from '../../assets/left_arrow.png';
import rightArrow from '../../assets/right_arrow.png';
import cover1 from '../../assets/mainpage/cover1.jpg';
import cover2 from '../../assets/mainpage/cover2.jpg';
import cover3 from '../../assets/mainpage/cover3.jpg';
import cover4 from '../../assets/mainpage/cover4.jpg';
import cover5 from '../../assets/mainpage/cover5.jpg';
import cover6 from '../../assets/mainpage/cover6.jpg';
import cover8 from '../../assets/mainpage/cover8.jpg';
import cover9 from '../../assets/mainpage/cover9.jpg';
import cover10 from '../../assets/mainpage/cover10.jpg';
import styles from './Banner.module.css';

const covers = [
  cover1,
  cover2,
  cover3,
  cover4,
  cover5,
  cover6,
  cover8,
  cover9,
  cover10,
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false);
  const autoSlideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = covers.map(
        (src) =>
          new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = src;
          })
      );

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('이미지 로딩 실패:', error);
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    setCurrentImageLoaded(false);
    const img = new Image();
    img.onload = () => setCurrentImageLoaded(true);
    img.src = covers[currentIndex];
  }, [currentIndex]);

  const scheduleNextSlide = useCallback(() => {
    if (autoSlideTimeoutRef.current !== null) {
      window.clearTimeout(autoSlideTimeoutRef.current);
    }
    autoSlideTimeoutRef.current = window.setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % covers.length);
    }, 5000);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + covers.length) % covers.length
    );
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % covers.length);
  }, []);

  useEffect(() => {
    scheduleNextSlide();
    return () => {
      if (autoSlideTimeoutRef.current !== null) {
        window.clearTimeout(autoSlideTimeoutRef.current);
      }
    };
  }, [currentIndex, scheduleNextSlide]);

  return (
    <div className={styles.bannerContainer}>
      {!imagesLoaded && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <p>이미지를 불러오는 중...</p>
        </div>
      )}

      <div
        className={`${styles.banner} ${
          currentImageLoaded ? styles.loaded : ''
        }`}
        style={{ backgroundImage: `url(${covers[currentIndex]})` }}
      >
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContentWrapper}>
          <button
            className={`${styles.arrowButton} ${styles.left}`}
            onClick={handlePrev}
            aria-label="이전 이미지"
            type="button"
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
            type="button"
          >
            <img src={rightArrow} alt="Right" />
          </button>
        </div>
      </div>

      <div className={styles.indicators}>
        {covers.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.active : ''
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`${index + 1}번째 이미지로 이동`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
