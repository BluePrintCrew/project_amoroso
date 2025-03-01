import React from 'react';
import styles from './CategoryMenu.module.css';

const categories = [
  { id: 1, name: '침실' },
  { id: 2, name: '거실' },
  { id: 3, name: '다이닝' },
  { id: 4, name: '옷장&드레스룸' },
  { id: 5, name: '키즈' },
  { id: 6, name: '학생' },
  { id: 7, name: '홈오피스' },
  { id: 8, name: '홈데코' },
  { id: 9, name: 'TODAY DEAL', special: true },
  { id: 10, name: '이벤트', special: true },
];

const CategoryMenu = () => {
  return (
    <div className={styles.categoryMenu}>
      {categories.map((category) => (
        <div
          key={category.id}
          className={`${styles.categoryItem} ${
            category.special ? styles.special : ''
          }`}
        >
          <div className={styles.placeholder}></div>
          <p className={styles.text}>{category.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
