import React from 'react';
import styles from './CategoryMenu.module.css';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, name: '거실', topCategry: 'LIVING' },
  { id: 2, name: '침실', topCategry: 'BEDROOM' },
  { id: 3, name: '주방', topCategry: 'KITCHEN' },
  { id: 4, name: '홈오피스', topCategry: 'OFFICE' },
  { id: 5, name: '옷장&드레스룸', topCategry: 'DRESSING' },
  { id: 6, name: '홈데코', topCategry: 'ETC' },
  { id: 7, name: 'TODAY DEAL', special: true },
  { id: 8, name: '이벤트', special: true },
];

const CategoryMenu = () => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    if (!category.topCategry) return;
    navigate(`/products?top=${category.topCategry}`);
  };

  return (
    <div className={styles.categoryMenu}>
      {categories.map((category) => (
        <div
          key={category.id}
          className={`${styles.categoryItem} ${
            category.special ? styles.special : ''
          }`}
          onClick={() => handleClick(category)}
        >
          <div className={styles.placeholder}></div>
          <p className={styles.text}>{category.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
