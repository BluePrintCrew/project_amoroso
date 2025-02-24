import React, { useEffect } from 'react';

import AdminHeader from '../AdminHeader/AdminHeader';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import { Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  useEffect(() => {
    // 모든 /admin 경로에서 root의 margin을 0으로 설정
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
      <AdminSidebar />
      <div className={styles.adminContent}>
        <AdminHeader />
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
