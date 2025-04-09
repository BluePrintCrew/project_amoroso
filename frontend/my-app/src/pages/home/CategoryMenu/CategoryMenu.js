import React, { useState } from 'react';
import './CategoryMenu.css';

// 이미 정의된 카테고리 매핑 정보 (필요 시 별도의 파일로 분리 후 import 가능)
const topCategoryMap = {
  LIVING: '거실',
  BEDROOM: '침실',
  KITCHEN: '주방',
  OFFICE: '사무실',
  DRESSING: '드레스룸',
  ETC: '기타',
};

function CategoryMenu({ onCategorySelect }) {
  // 현재 선택된 카테고리 상태 (UI 개선을 위한 active state)
  const [selectedCategory, setSelectedCategory] = useState(null);

  // topCategoryMap 객체의 키와 라벨을 이용하여 카테고리 배열 생성
  const categories = Object.entries(topCategoryMap).map(([key, label]) => ({
    key,
    label,
  }));

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (key) => {
    setSelectedCategory(key);
    // 부모 컴포넌트로 선택된 카테고리 키 전달
    if (onCategorySelect) {
      onCategorySelect(key);
    }
  };

  return (
    <nav className="category-menu">
      {categories.map(({ key, label }) => (
        <button 
          key={key} 
          className={`category-button ${selectedCategory === key ? 'active' : ''}`}
          onClick={() => handleCategoryClick(key)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

export default CategoryMenu;
