import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductSection from '../ProductSection/ProductSection';

const BestProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/products/');
        const sorted = res.data.products
          .sort((a, b) => b.salesCount - a.salesCount)
          .slice(0, 4);
        setProducts(sorted);
      } catch (err) {
        console.error('베스트 상품 불러오기 실패:', err);
      }
    };
    fetchBestProducts();
  }, []);

  return (
    <ProductSection
      title="Amoroso Best"
      products={products}
      showMoreLink="/products"
      gridColumns={4}
    />
  );
};

export default BestProducts;
