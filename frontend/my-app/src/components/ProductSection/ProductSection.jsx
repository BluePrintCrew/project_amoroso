import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductSection.module.css';
import ProductCard from '../ProductCard/ProductCard';

const ProductSection = ({ 
  title, 
  products, 
  showMoreLink = '/products',
  gridColumns = 4,
  className = ''
}) => {
  const navigate = useNavigate();

  return (
    <section className={`${styles.section} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button 
          className={styles.moreButton} 
          onClick={() => navigate(showMoreLink)}
        >
          더보기 &gt;
        </button>
      </div>
      <div 
        className={styles.productGrid}
        style={{ 
          '--grid-columns': gridColumns,
          '--grid-gap': '24px'
        }}
      >
        {products.map((product) => (
          <ProductCard 
            key={product.productId} 
            product={product}
            className={styles.productCard}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductSection; 