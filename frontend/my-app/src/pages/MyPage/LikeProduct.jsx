import './LikeProduct.css';

import React, { useEffect, useState } from 'react';

import PageLayout from '../../components/PageLayout/PageLayout';
import ProductCard from '../../components/ProductCard/ProductCard';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Replace hardcoded API_BASE_URL with imported constant
const API_ENDPOINT = `${API_BASE_URL}/api/v1`;

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikeProducts = async () => {
      const token = localStorage.getItem('access_token');
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_ENDPOINT}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('찜 목록을 불러오는데 실패했습니다.');

        const data = await response.json();
        console.log(data);
        setProducts(data);
        setTotalItems(data.length);
        return data.products || [];
      } catch (err) {
        setError(err.message);
        setProducts([]);
        return [];
      }
    };

    fetchLikeProducts().finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="content-wrapper">
        <div className="category-selector">
          <h1 className="like-title"> 찜한 상품</h1>
        </div>
        {loading ? (
          <p className="loading-text">로딩 중...</p>
        ) : error ? (
          <p className="error-text">❌ {error}</p>
        ) : (
          <>
            <div className="product-grid">
              {products.length === 0 ? (
                <p className="no-products">상품이 없습니다.</p>
              ) : (
                products.map((prod) => (
                  <ProductCard
                    key={prod.productId}
                    product={{
                      ...prod,
                      imageUrl: prod.primaryImageURL || '', // 상품 정보에서 이미지 URL 직접 사용
                    }}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default ProductListPage;
