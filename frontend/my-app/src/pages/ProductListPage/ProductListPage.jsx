// src/pages/ProductListPage/ProductListPage.jsx

import './ProductListPage.css';
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import ProductCard from '../../components/ProductCard/ProductCard';

// 상위 카테고리 -> 하위 카테고리 배열
const categoryMap = {
  LIVING: [
    { label: "소파", value: "LIV_SOFA" },
    { label: "장식장", value: "LIV_DISPLAY" },
    { label: "탁자", value: "LIV_TABLE" },
  ],
  BEDROOM: [
    { label: "침대", value: "BED_BED" },
    { label: "침대 깔판", value: "BED_BASE" },
    { label: "협탁", value: "BED_NIGHTSTAND" },
  ],
  KITCHEN: [
    { label: "식탁 & 의자", value: "KIT_DINING" },
  ],
  OFFICE: [
    { label: "책상", value: "OFF_DESK" },
    { label: "의자", value: "OFF_CHAIR" },
    { label: "책장", value: "OFF_BOOKSHELF" },
  ],
  DRESSING: [
    { label: "장롱", value: "DRESS_WARDROBE" },
    { label: "화장대", value: "DRESS_TABLE" },
    { label: "드레스", value: "DRESS_DRESSER" },
    { label: "서랍장", value: "DRESS_DRAWER" },
  ],
  ETC: [
    { label: "소품", value: "ETC_DECOR" },
    { label: "벽걸이 거울", value: "ETC_WALL_MIRROR" },
    { label: "액세서리", value: "ETC_ACCESSORY" },
    { label: "거울", value: "ETC_GENERAL_MIRROR" },
  ],
};

function ProductListPage() {
  // 상위 카테고리 목록
  const topCategories = Object.keys(categoryMap); 
  // ex) ["LIVING", "BEDROOM", "KITCHEN", "OFFICE", "DRESSING", "ETC"]

  // 선택된 상위 카테고리, 하위 카테고리
  const [selectedTop, setSelectedTop] = useState(topCategories[0]); 
  const [selectedSub, setSelectedSub] = useState('');

  // 상품 배열
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 현재 상위 카테고리에 해당하는 하위 카테고리 목록
  const subCategoryList = categoryMap[selectedTop] || [];

  // 하위 카테고리를 선택할 때마다 업데이트
  const handleSubCategoryChange = (e) => {
    setSelectedSub(e.target.value);
  };

  // 상위 카테고리를 변경하면 하위 카테고리 배열이 달라지므로, subCategory를 초기화
  const handleTopCategoryChange = (e) => {
    const newTop = e.target.value;
    setSelectedTop(newTop);
    // 첫 번째 하위 카테고리를 기본 선택 (또는 빈 값)
    const firstSub = categoryMap[newTop]?.[0]?.value || '';
    setSelectedSub(firstSub);
  };

  // 상품 목록 불러오기
  useEffect(() => {
    // selectedSub가 비어있으면 요청하지 않음
    if (!selectedSub) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        // JWT 토큰이 필요하면 가져오기
        const token = localStorage.getItem('accessToken');

        const res = await fetch(
          `http://localhost:8080/api/v1/products/?categoryCode=${selectedSub}`,

        );
        if (!res.ok) {
          throw new Error('상품 데이터를 불러오는데 실패했습니다.');
        }

        const data = await res.json();
        // data 구조: { totalPages, totalItems, products: [...] }
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

  // 초기 설정: 페이지 로드 시 상위 카테고리 기본값의 첫 번째 하위 카테고리 선택
  useEffect(() => {
    // 첫 마운트 시 selectedTop이 초기화된 뒤에 하위 카테고리도 세팅
    const firstSub = categoryMap[selectedTop]?.[0]?.value || '';
    setSelectedSub(firstSub);
  }, [selectedTop]);

  return (
    <div className="product-list-page">
      <Header />

      <div className="content-wrapper">
        <nav className="breadcrumb">
          <span className="home-icon">🏠</span> &gt;
          <span className="category"> {selectedTop} </span> &gt;
          <span className="current"> {selectedSub}</span>
        </nav>

        <h2 className="page-title">상품 목록</h2>

        {/* 상위 카테고리 선택 */}
        <div className="top-category-selector">
          <label>상위 카테고리:</label>
          <select value={selectedTop} onChange={handleTopCategoryChange}>
            {topCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 하위 카테고리 선택 */}
        <div className="sub-category-selector">
          <label>하위 카테고리:</label>
          <select value={selectedSub} onChange={handleSubCategoryChange}>
            {subCategoryList.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>

        {/* 로딩/에러/정상 상태 표시 */}
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

      <Footer />
    </div>
  );
}

export default ProductListPage;
