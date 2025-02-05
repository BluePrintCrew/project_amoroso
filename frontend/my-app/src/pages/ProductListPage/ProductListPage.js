// src/pages/ProductListPage/ProductListPage.jsx
import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ProductListPage.css';

// ✅ 더미 데이터 (20개)
const allDummyProducts = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `식탁의자 ${index + 1}`,
  price: Math.floor(Math.random() * 200000) + 300000,
  discount: Math.floor(Math.random() * 30),
  originalPrice: Math.floor(Math.random() * 200000) + 500000,
  shipping: index % 2 === 0 ? '무료배송' : '유료배송',
  rating: (Math.random() * 2 + 3).toFixed(1),
  reviewCount: Math.floor(Math.random() * 500) + 1,
  imageUrl: 'https://via.placeholder.com/150',
}));

function ProductListPage() {
  return (
    <div className="product-list-page">
      {/* ✅ 헤더 추가 */}
      <Header />

      <div className="content-wrapper">
        {/* ✅ 네비게이션 추가 */}
        <nav className="breadcrumb">
          <span className="home-icon">🏠</span> &gt;
          <span className="category"> 다이닝 </span> &gt;
          <span className="current"> 식탁의자</span>
        </nav>

        <h2 className="page-title">식탁의자</h2>

        {/* 상품 개수 & 정렬 버튼 */}
        <div className="product-count-sort">
          <span className="total-count">전체 {allDummyProducts.length}건</span>
          <div className="sort-menu">
            <button>인기순</button>
            <button>최신순</button>
            <button>낮은가격순</button>
            <button>높은가격순</button>
          </div>
        </div>

        {/* 상품 리스트 */}
        <div className="product-grid">
          {allDummyProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

      {/* ✅ 푸터 추가 */}
      <Footer />
    </div>
  );
}

export default ProductListPage;
