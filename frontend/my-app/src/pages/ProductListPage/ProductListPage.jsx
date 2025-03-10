// src/pages/ProductListPage/ProductListPage.jsx

import React, { useEffect, useState } from 'react';
import './ProductListPage.css';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import ProductCard from '../../components/ProductCard/ProductCard';

// Pretendard 폰트를 전역에서 import할 수도 있지만,
// 예: index.html 또는 전역 CSS에서 @import
// @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

// 홈 아이콘 이미지
import homeicon from '../../assets/nav_home.png';

// 상위 카테고리 코드 -> 한글 레이블
const topCategoryMap = {
  LIVING: '거실',
  BEDROOM: '침실',
  KITCHEN: '주방',
  OFFICE: '사무실',
  DRESSING: '드레스룸',
  ETC: '기타'
};
// 상위 카테고리 -> 하위 카테고리 매핑
const categoryMap = {
  LIVING: [
    { label: '소파', value: 'LIV_SOFA' },
    { label: '장식장', value: 'LIV_DISPLAY' },
    { label: '탁자', value: 'LIV_TABLE' },
  ],
  BEDROOM: [
    { label: '침대', value: 'BED_BED' },
    { label: '침대 깔판', value: 'BED_BASE' },
    { label: '협탁', value: 'BED_NIGHTSTAND' },
  ],
  KITCHEN: [
    { label: '식탁 & 의자', value: 'KIT_DINING' },
  ],
  OFFICE: [
    { label: '책상', value: 'OFF_DESK' },
    { label: '의자', value: 'OFF_CHAIR' },
    { label: '책장', value: 'OFF_BOOKSHELF' },
  ],
  DRESSING: [
    { label: '장롱', value: 'DRESS_WARDROBE' },
    { label: '화장대', value: 'DRESS_TABLE' },
    { label: '드레스', value: 'DRESS_DRESSER' },
    { label: '서랍장', value: 'DRESS_DRAWER' },
  ],
  ETC: [
    { label: '소품', value: 'ETC_DECOR' },
    { label: '벽걸이 거울', value: 'ETC_WALL_MIRROR' },
    { label: '액세서리', value: 'ETC_ACCESSORY' },
    { label: '거울', value: 'ETC_GENERAL_MIRROR' },
  ],
};

function ProductListPage() {
  // 상위 카테고리 목록 추출
  const topCategories = Object.keys(categoryMap);

  // 선택된 상위 카테고리, 하위 카테고리
  const [selectedTop, setSelectedTop] = useState(topCategories[0]);
  const [selectedSub, setSelectedSub] = useState('');

  // 상품 목록
  const [products, setProducts] = useState([]);
  // 페이지네이션 정보
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // 로딩 & 에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 현재 상위 카테고리에 대한 하위 카테고리 목록
  const subCategoryList = categoryMap[selectedTop] || [];

  // 상위 카테고리 변경 시
  const handleTopCategoryChange = (e) => {
    const newTop = e.target.value;
    setSelectedTop(newTop);
    // 해당 상위 카테고리의 첫 하위 항목을 기본 선택
    const firstSub = categoryMap[newTop]?.[0]?.value || '';
    setSelectedSub(firstSub);
  };

  // 하위 카테고리 변경 시
  const handleSubCategoryChange = (e) => {
    setSelectedSub(e.target.value);
  };

  // 첫 마운트 또는 상위 카테고리 바뀔 때 하위 카테고리 초기화
  useEffect(() => {
    const firstSub = categoryMap[selectedTop]?.[0]?.value || '';
    setSelectedSub(firstSub);
  }, [selectedTop]);

  // 하위 카테고리가 선택될 때마다 상품 목록 불러오기
  useEffect(() => {
    if (!selectedSub) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        // 토큰이 필요 없다면 이 부분을 제거하거나 주석 처리
        const token = localStorage.getItem('accessToken');

        const response = await fetch(
          `http://localhost:8080/api/v1/products/?categoryCode=${selectedSub}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );

        if (!response.ok) {
          throw new Error('상품 데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        // data 구조 예시: { totalPages, totalItems, products: [...] }
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 0);
        setTotalItems(data.totalItems || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedSub]);
// breadcrumb 안에서:
const currentSubCategory = subCategoryList.find(
  (sub) => sub.value === selectedSub
);
  return (
    <div className="product-list-page">
      <Header />

      <div className="content-wrapper">
<nav className="breadcrumb">
  <img src={homeicon} alt="홈 아이콘" className="home-icon" />
  <span className="separator">&gt;</span>
  <span className="category">{topCategoryMap[selectedTop]}</span>
  <span className="separator">&gt;</span>
  <span className="current">
    {currentSubCategory ? currentSubCategory.label : ''}
  </span>
</nav>
     {/*   <h2 className="page-title">상품 목록</h2> */}

<div className="category-selector">
       {/* 상위 카테고리 선택 */}
<div className="top-category-selector">
  <label>상위 카테고리: </label>
  <select value={selectedTop} onChange={handleTopCategoryChange}>
    {topCategories.map((cat) => (
      <option key={cat} value={cat}>
        {topCategoryMap[cat]} {/* 한글 레이블 표시 */}
      </option>
    ))}
  </select>
</div> 

        {/* 하위 카테고리 선택 */}
        <div className="sub-category-selector">
          <label>하위 카테고리: </label>
          <select value={selectedSub} onChange={handleSubCategoryChange}>
            {subCategoryList.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>
</div>
        {loading ? (
          <p className="loading-text">로딩 중...</p>
        ) : error ? (
          <p className="error-text">❌ {error}</p>
        ) : (
          <>
            <div className="product-count-sort">
              <span className="total-count">전체 {totalItems}건</span>
              <div className="sort-menu">
                <button>인기순</button>
                <button>최신순</button>
                <button>낮은가격순</button>
                <button>높은가격순</button>
              </div>
            </div>

            <div className="product-grid">
              {products.map((prod) => (
                <ProductCard key={prod.productId} product={prod} />
              ))}
            </div>

            <div className="pagination">
              <p>전체 페이지: {totalPages}페이지</p>
            </div>
          </>
        )}
      </div>

      {/* <Footer /> */} 
    </div>
  );
}

export default ProductListPage;
