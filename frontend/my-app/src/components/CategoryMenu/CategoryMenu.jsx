import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CategoryMenu.module.css';

// 이미지 직접 임포트 (실제 파일 경로에 맞게 수정)
import livingImage from '../../assets/mainpage/category/living.jpg';
import bedroomImage from '../../assets/mainpage/category/bedroom.jpg';
import kitchenImage from '../../assets/mainpage/category/kitchen.jpg';
import officeImage from '../../assets/mainpage/category/homeoffice.jpg';
import dressingImage from '../../assets/mainpage/category/dressing.jpg';
import etcImage from '../../assets/mainpage/category/etc.jpg';

const categories = [
  { id: 1, name: '거실', topCategory: 'LIVING', image: livingImage },
  { id: 2, name: '침실', topCategory: 'BEDROOM', image: bedroomImage },
  { id: 3, name: '주방', topCategory: 'KITCHEN', image: kitchenImage },
  { id: 4, name: '홈오피스', topCategory: 'OFFICE', image: officeImage },
  { id: 5, name: '옷장&드레스룸', topCategory: 'DRESSING', image: dressingImage },
  { id: 6, name: '홈데코', topCategory: 'ETC', image: etcImage },
];

const CategoryMenu = () => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    // special 카테고리는 이동하지 않음
    if (!category.topCategory) return;
    navigate(`/products?top=${category.topCategory}`);
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
          {category.image ? (
            <img
              className={styles.categoryImage}
              src={category.image}
              alt={category.name}
            />
          ) : (
            <div className={styles.placeholder}>이미지 없음</div>
          )}
          <p className={styles.text}>{category.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
