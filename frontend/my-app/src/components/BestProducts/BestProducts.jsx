import React, { useState } from 'react';

import leftArrow from '../../assets/left_arrow.png';
import rightArrow from '../../assets/right_arrow.png';
import styles from './BestProducts.module.css';

const products = [
  {
    id: 1,
    name: '베스트상품 1',
    price: 473000,
    originalPrice: 777000,
    discount: 18,
  },
  {
    id: 1,
    name: '베스트상품 2',
    price: 473000,
    originalPrice: 777000,
    discount: 18,
  },
  {
    id: 1,
    name: '베스트상품 3',
    price: 473000,
    originalPrice: 777000,
    discount: 18,
  },
  {
    id: 1,
    name: '베스트상품 4',
    price: 473000,
    originalPrice: 777000,
    discount: 18,
  },
];

const BestProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={styles.bestProducts}>
      <div className={styles.header}>
        <h2>Amoroso Best</h2>
        <a href="#" className={styles.more}>
          더보기 &gt;
        </a>
      </div>

      <div className={styles.slider}>
        <button
          className={`${styles.arrowButton} ${styles.left}`}
          onClick={handlePrev}
        >
          <img src={leftArrow} alt="Previous" />
        </button>

        <div className={styles.productList}>
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`${styles.productCard} ${
                index === currentIndex ? styles.active : ''
              }`}
            >
              <div className={styles.imagePlaceholder}></div>
              <h3 className={styles.productName}>{product.name}</h3>
              <div className={styles.priceSection}>
                <span className={styles.price}>
                  {product.price.toLocaleString()}원
                </span>
                <span className={styles.originalPrice}>
                  {product.originalPrice.toLocaleString()}원
                </span>
                <span className={styles.discount}>{product.discount}%</span>
              </div>
            </div>
          ))}
        </div>
        <button
          className={`${styles.arrowButton} ${styles.right}`}
          onClick={handleNext}
        >
          <img src={rightArrow} alt="Next" />
        </button>
      </div>
    </div>
  );
};

export default BestProducts;
