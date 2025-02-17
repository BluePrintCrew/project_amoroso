import React from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar/AdminSidebar";
import AdminHeader from "../../components/Admin/AdminHeader/AdminHeader";
import "./AdminPage.css";

function AdminPage() {
  return (
    <div className="admin-page-container">
     {/* <AdminHeader /> */}
      <AdminSidebar />
      <div className="admin-page-content">
        {/* ... */}
      </div>
    </div>
  );
}

export default AdminPage;
