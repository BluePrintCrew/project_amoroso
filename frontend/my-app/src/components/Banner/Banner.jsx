import React, { useState } from 'react';
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

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + covers.length) % covers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % covers.length);
  };

  return (
    <div
      className={styles.banner}
      style={{ backgroundImage: `url(${covers[currentIndex]})` }}
    >
      <div className={styles.bannerContentWrapper}>
        <button
          className={`${styles.arrowButton} ${styles.left}`}
          onClick={handlePrev}
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
        >
          <img src={rightArrow} alt="Right" />
        </button>
      </div>
    </div>
  );
}

export default Banner;
