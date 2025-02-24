import AdminHeader from '../../../components/Admin/AdminHeader/AdminHeader';
import AdminSidebar from '../../../components/Admin/AdminSidebar/AdminSidebar';
import React from 'react';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
  return (
    <div className={styles.adminContent}>
      <div className={styles.productsContainer}></div>
    </div>
  );
};

export default ProductsPage;
