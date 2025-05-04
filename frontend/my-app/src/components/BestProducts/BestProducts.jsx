import React, { useEffect, useState } from 'react';

import axios from 'axios';
import leftArrow from '../../assets/left_arrow.png';
import rightArrow from '../../assets/right_arrow.png';
import styles from './BestProducts.module.css';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: '베스트상품 1',
    price: 473000,
    originalPrice: 777000,
    discount: 18,
  },
  {
    id: 1,
    name: '베스트상품 2',
    price: 473000,
    originalPrice: 777000,
    discount: 18,
  },
  {
    id: 1,
    name: '베스트상품 3',
    price: 473000,
    originalPrice: 777000,
    discount: 18,
  },
  {
    id: 1,
    name: '베스트상품 4',
    price: 473000,
    originalPrice: 777000,
    discount: 18,
  },
];

const BestProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/products/');
        console.log('res.data:', res.data);
        const sorted = res.data.products
          .sort((a, b) => b.salesCount - a.salesCount)
          .slice(0, 4);

        setProducts(sorted);
        console.log('sorted: ', sorted);
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
        <a href="#" className={styles.more}>
          더보기 &gt;
        </a>
      </div>

      <div className={styles.slider}>
        <div className={styles.productList}>
          {products.map((product) => (
            <div
              key={product.productId}
              className={styles.productCard}
              onClick={() => navigate(`/product/${product.productId}`)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={
                    product.primaryImageURL
                      ? `http://localhost:8080/api/v1/images/${product.primaryImageURL
                          .split('/')
                          .pop()}`
                      : 'https://placehold.co/300x300?text=No+image'
                  }
                  alt={product.productName}
                  className={styles.productImage}
                />
              </div>
              <h3 className={styles.productName}>{product.productName}</h3>
              <div className={styles.priceSection}>
                <span className={styles.price}>
                  {product.discountPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestProducts;
