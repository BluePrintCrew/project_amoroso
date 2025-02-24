import ProductTable from '../../../components/Admin/ProductTable/ProductTable';
import React from 'react';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.productsContainer}>
        <ProductTable />
      </div>
    </div>
  );
};

export default ProductsPage;
