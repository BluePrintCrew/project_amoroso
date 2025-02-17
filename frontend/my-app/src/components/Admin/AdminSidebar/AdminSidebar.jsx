import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

import logo from "../../../assets/logo.png";
import homeIcon from "../../../assets/home.png";
import memberIcon from "../../../assets/member.png";
import cartIcon from "../../../assets/cart.png";
import graphIcon from "../../../assets/graph.png";
import paperIcon from "../../../assets/paper.png";
import SVG from "../../../assets/SVG.png"; // '>' arrow icon

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Amoroso Logo" className="logo-img" />
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/admin/dashboard" className="menu-item active">
          <img src={homeIcon} alt="Home" className="menu-icon" />
          <span className="menu-text">대시보드</span>
          <img src={SVG} alt=">" className="arrow-icon" />
        </NavLink>

        <NavLink to="/admin/users" className="menu-item">
          <img src={memberIcon} alt="Member" className="menu-icon" />
          <span className="menu-text">회원관리</span>
          <img src={SVG} alt=">" className="arrow-icon" />
        </NavLink>

        <NavLink to="/admin/products" className="menu-item">
          <img src={cartIcon} alt="Cart" className="menu-icon" />
          <span className="menu-text">상품관리</span>
          <img src={SVG} alt=">" className="arrow-icon" />
        </NavLink>

        <NavLink to="/admin/sales" className="menu-item">
          <img src={graphIcon} alt="Graph" className="menu-icon" />
          <span className="menu-text">매출현황</span>
          <img src={SVG} alt=">" className="arrow-icon" />
        </NavLink>

        <NavLink to="/admin/orders" className="menu-item">
          <img src={paperIcon} alt="Paper" className="menu-icon" />
          <span className="menu-text">주문관리</span>
          <img src={SVG} alt=">" className="arrow-icon" />
        </NavLink>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
