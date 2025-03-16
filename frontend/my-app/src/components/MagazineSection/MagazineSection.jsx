import React, { useState } from 'react';

import leftArrow from '../../assets/left_arrow.png';
import rightArrow from '../../assets/right_arrow.png';
import styles from './MagazineSection.module.css';

const magazineData = [
  {
    title: 'Amoroso는 어떻게 다를까요?',
    description: '끝없는 도전으로 녹여낸 장인정신',
    image: 'https://placehold.co/500x300', // 여기에 실제 이미지 URL 넣기
  },
  {
    title: '이탈리아 장인의 가구 제작 과정',
    description: '수십 년간 이어온 전통과 품질',
    image: 'https://placehold.co/500x300',
  },
  {
    title: '지속 가능한 가구 디자인',
    description: '친환경 소재와 혁신적인 디자인',
    image: 'https://placehold.co/500x300',
  },
  {
    title: '모던한 가구 스타일 가이드',
    description: '트렌디한 인테리어를 위한 팁',
    image: 'https://placehold.co/500x300',
  },
  {
    title: 'Amoroso의 특별한 제작 기법',
    description: '차별화된 기술과 품질 보장',
    image: 'https://placehold.co/500x300',
  },
];

const MagazineSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % magazineData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? magazineData.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={styles.magazineSection}>
      <h2 className={styles.title}>Magazine</h2>
      <div className={styles.magazineContainer}>
        <button
          className={`${styles.arrowButton} ${styles.left}`}
          onClick={handlePrev}
        >
          <img src={leftArrow} alt="Previous" />
        </button>

        <div className={styles.magazineSlide}>
          <div className={styles.textContent}>
            <h3>{magazineData[currentIndex].title}</h3>
            <p>{magazineData[currentIndex].description}</p>
          </div>
          <div
            className={styles.imageContent}
            style={{
              backgroundImage: `url(${magazineData[currentIndex].image})`,
            }}
          ></div>
        </div>

        <button
          className={`${styles.arrowButton} ${styles.right}`}
          onClick={handleNext}
        >
          <img src={rightArrow} alt="Next" />
        </button>
      </div>
      <div className={styles.pagination}>
        {currentIndex + 1} / {magazineData.length}
      </div>
    </div>
  );
};

export default MagazineSection;
