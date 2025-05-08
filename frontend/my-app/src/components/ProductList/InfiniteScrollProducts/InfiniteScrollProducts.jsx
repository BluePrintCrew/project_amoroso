import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../../ProductCard/ProductCard';
import styles from './InfiniteScrollProducts.module.css';
import { API_BASE_URL } from '../../../pages/MyPage/api';

const InfiniteScrollProducts = ({ categoryCode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const observer = React.useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/v1/products/?categoryCode=${categoryCode}&page=${page}&size=12`
        );
        
        if (!response.ok) {
          throw new Error('상품을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        
        // API 응답 구조 확인 및 안전한 처리
        const newProducts = Array.isArray(data.products) ? data.products : [];
        
        if (page === 1) {
          setProducts(newProducts);
        } else {
          setProducts(prevProducts => [...prevProducts, ...newProducts]);
        }
        setHasMore(newProducts.length > 0);
      } catch (error) {
        console.error('상품을 불러오는데 실패했습니다:', error);
        setProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryCode, page]);

  // products가 undefined일 경우를 대비
  if (!Array.isArray(products)) {
    return <div className={styles.loading}>상품을 불러오는 중입니다...</div>;
  }

  return (
    <div className={styles.productGrid}>
      {products.length > 0 ? (
        products.map((product, index) => (
          <div
            key={product.productId}
            ref={index === products.length - 1 ? lastProductElementRef : null}
          >
            <ProductCard product={product} />
          </div>
        ))
      ) : null}
      {loading && <div className={styles.loading}>로딩중...</div>}
    </div>
  );
};

export default InfiniteScrollProducts;
