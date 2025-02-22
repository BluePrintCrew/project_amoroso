import React, { useEffect } from 'react';

import AdminCard from '../../components/Admin/AdminCard/AdminCard';
import AdminChart from '../../components/Admin/AdminChart/AdminChart';
import AdminHeader from '../../components/Admin/AdminHeader/AdminHeader';
import AdminSidebar from '../../components/Admin/AdminSidebar/AdminSidebar';
import TopProducts from '../../components/Admin/TopProducts/TopProducts';
import styles from './AdminPage.module.css';

function AdminPage() {
  useEffect(() => {
    // Remove default margins/padding from the root element
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const originalMargin = rootElement.style.margin;

      rootElement.style.margin = '0';

      return () => {
        rootElement.style.margin = originalMargin;
      };
    }
  }, []);

  return (
    <div className={styles.adminPage}>
      {/* Sidebar pinned on the left */}
      <AdminSidebar />

      {/* Main column: header on top, content below */}
      <div className={styles.adminContent}>
        <AdminHeader />
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
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
