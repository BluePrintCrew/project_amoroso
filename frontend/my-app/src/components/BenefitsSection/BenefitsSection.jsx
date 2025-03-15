import React from 'react';
import styles from './BenefitsSection.module.css';

const BenefitsSection = () => {
  return (
    <div className={styles.benefitsSection}>
      <h2 className={styles.title}>Amoroso 만의 혜택</h2>
      <div className={styles.benefitsContainer}>
        <div
          className={styles.benefitCard}
          style={{ backgroundImage: `url('https://placehold.co/685x685')` }}
        >
          <div className={styles.overlay}></div>
          <div className={styles.text}>
            <h3>사랑하는 가족을 위한 리빙 룸</h3>
            <p>홈데코&조명&베스트셀러 기획전</p>
          </div>
        </div>

        <div
          className={styles.benefitCard}
          style={{ backgroundImage: `url('https://placehold.co/685x685')` }}
        >
          <div className={styles.overlay}></div>
          <div className={styles.text}>
            <h3>더 정통한 다이닝&소파</h3>
            <p>이탈리 가구 기획전</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
