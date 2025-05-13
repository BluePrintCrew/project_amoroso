import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './BestProducts.module.css';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import InfiniteScrollProducts from '../ProductList/InfiniteScrollProducts/InfiniteScrollProducts';

const BestProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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
    <div className={styles.bestProducts}>
      <div className={styles.header}>
        <h2>Amoroso Best</h2>
        <button className={styles.moreBtn} onClick={() => navigate('/productlist')}>
          더보기 &gt;
        </button>
      </div>
      <div className={styles.productList}>
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestProducts;
