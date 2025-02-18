import React, { useEffect } from "react";

import AdminHeader from "../../components/Admin/AdminHeader/AdminHeader";
import AdminSidebar from "../../components/Admin/AdminSidebar/AdminSidebar";
import styles from "./AdminPage.module.css";

function AdminPage() {
  useEffect(()=>{
    const rootElement=document.getElementById("root");
    const originalMargin=rootElement.style.margin;

    rootElement.style.margin="0";
    rootElement.style.padding="0";

    return()=>{
      rootElement.style.margin=originalMargin;
    };
  },[])
  
  return (
    <div className={styles.AdminPage}>
     {/* <AdminHeader /> */}
      <AdminSidebar />
      </div>
  );
}

export default AdminPage;
