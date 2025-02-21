import React from 'react';
import styles from './TopProducts.module.css';

const topProducts = [
  {
    id: 1,
    name: '수납장 상품명 1',
    category: '수납장',
    code: '202501201627',
    price: 136900,
  },
  {
    id: 2,
    name: '수납장 상품명 1',
    category: '수납장',
    code: '202501201627',
    price: 136900,
  },
  {
    id: 3,
    name: '수납장 상품명 1',
    category: '수납장',
    code: '202501201627',
    price: 136900,
  },
  {
    id: 4,
    name: '수납장 상품명 1',
    category: '수납장',
    code: '202501201627',
    price: 136900,
  },
  {
    id: 5,
    name: '수납장 상품명 1',
    category: '수납장',
    code: '202501201627',
    price: 136900,
  },
];

const TopProducts = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>인기상품 TOP 5</h2>
        <select className={styles.dropdown}>
          <option>연 기준</option>
        </select>
      </div>
    </div>
  );
};

export default TopProducts;
