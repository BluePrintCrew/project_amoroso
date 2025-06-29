import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const API_ENDPOINT = `${API_BASE_URL}/api/v1`;

export const useProducts = (options = {}) => {
  const {
    categoryCode,
    keyword,
    page = 1,
    sortBy = 'createdAt',
    order = 'desc',
    size = 12,
  } = options;

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      // 검색 모드가 아닐 때는 카테고리가 필요
      if (!keyword && !categoryCode) return;
      
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          sortBy,
          order,
          size: size.toString(),
        });

        if (keyword) {
          params.append('keyword', keyword);
        } else {
          params.append('categoryCode', categoryCode);
        }

        const response = await fetch(`${API_ENDPOINT}/products/?${params}`);
        
        if (!response.ok) {
          throw new Error('상품 데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 0);
        setTotalItems(data.totalItems || 0);
      } catch (err) {
        setError(err.message);
        setProducts([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryCode, keyword, page, sortBy, order, size]);

  return {
    products,
    totalPages,
    totalItems,
    loading,
    error,
  };
}; 