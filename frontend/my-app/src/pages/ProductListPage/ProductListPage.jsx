// src/pages/ProductListPage/ProductListPage.jsx
import './ProductListPage.css';
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import ProductCard from '../../components/ProductCard/ProductCard';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        
        const response = await fetch('http://localhost:8080/api/v1/products/');
        if (!response.ok) {
          throw new Error('상품 데이터를 불러오는데 실패했습니다.');
        }
        const data = await response.json();

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
  }, []);

  return (
    <div className="product-list-page">
      <Header />

      <div className="content-wrapper">
        <nav className="breadcrumb">
          <span className="home-icon">🏠</span> &gt;
          <span className="category"> 다이닝 </span> &gt;
          <span className="current"> 식탁의자</span>
        </nav>

        <h2 className="page-title">식탁의자</h2>

        {loading ? (
          <p className="loading-text">상품을 불러오는 중...</p>
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
              {/* 페이지네이션 로직 추가 가능 */}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ProductListPage;
