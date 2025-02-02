import React from 'react';
import './CategoryMenu.css';

function CategoryMenu() {
  const categories = [
    '침실',
    '거실',
    '다이닝',
    '장식장&스탠드',
    '키즈',
    '학생',
    '홈오피스',
    '쿠킹&테이블',
    '이벤트',
  ];

  return (
    <nav className="category-menu">
      {categories.map((category, idx) => (
        <button key={idx} className="category-button">
          {category}
        </button>
      ))}
    </nav>
  );
}

export default CategoryMenu;
