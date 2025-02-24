import React, { useEffect } from 'react';

import AdminCard from '../../components/Admin/AdminCard/AdminCard';
import AdminChart from '../../components/Admin/AdminChart/AdminChart';
import OrderTable from '../../components/Admin/OrderTable/OrderTable';
import TopProducts from '../../components/Admin/TopProducts/TopProducts';
import styles from './AdminPage.module.css';

function AdminPage() {
  return (
    <div className={styles.mainContent}>
      <div className={styles.topContent}>
        <div className={styles.cardSection}>
          {/* 4 cards in one row */}
          <AdminCard title="Card 1" />
          <AdminCard title="Card 2" />
          <AdminCard title="Card 3" />
          <AdminCard title="Card 4" />
        </div>
      </div>
      <div className={styles.middleContent}>
        <div className={styles.chartContainer}>
          <AdminChart />
        </div>
        <div className={styles.productContainer}>
          <TopProducts />
        </div>
      </div>
      <div className={styles.bottomContent}>
        <OrderTable />
      </div>
    </div>
  );
}

export default AdminPage;
