import React from 'react';
import leftArrow from '../../assets/left_arrow.png';
import rightArrow from '../../assets/right_arrow.png';
import styles from './Banner.module.css';

function Banner() {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerContentWrapper}>
        <button className={`${styles.arrowButton} ${styles.left}`}>
          <img src={leftArrow} alt="Left"></img>
        </button>

        <div className={styles.bannerContent}>
          <h1>당신의 일상을</h1>
          <h1>이탈리아 품격으로</h1>
          <p>이태리 가구 최대 30% 할인</p>
        </div>

        <button className={`${styles.arrowButton} ${styles.right}`}>
          <img src={rightArrow} alt="Right"></img>
        </button>
      </div>
    </div>
  );
}

export default Banner;
