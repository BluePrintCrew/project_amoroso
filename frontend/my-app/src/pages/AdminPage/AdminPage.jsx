import React, { useEffect } from "react";
import AdminHeader from "../../components/Admin/AdminHeader/AdminHeader";
import AdminSidebar from "../../components/Admin/AdminSidebar/AdminSidebar";
import AdminCard from "../../components/Admin/AdminCard/AdminCard";
import styles from "./AdminPage.module.css";

function AdminPage() {
  useEffect(() => {
    // Remove default margins/padding from the root element
    const rootElement = document.getElementById("root");
    const originalMargin = rootElement.style.margin;
    const originalPadding = rootElement.style.padding;

    rootElement.style.margin = "0";
    rootElement.style.padding = "0";

    return () => {
      rootElement.style.margin = originalMargin;
      rootElement.style.padding = originalPadding;
    };
  }, []);

  return (
    <div className={styles.AdminPage}>
      {/* Sidebar pinned on the left */}
      <AdminSidebar />

      {/* Main column: header on top, content below */}
      <div className={styles.MainArea}>
        <AdminHeader />
        <div className={styles.ContentArea}>
          {/* 4 cards in one row */}
          <AdminCard title="Card 1" />
          <AdminCard title="Card 2" />
          <AdminCard title="Card 3" />
          <AdminCard title="Card 4" />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
