import React from "react";
import "./AdminHeader.css";

// Icon imports
import listIcon from "../../../assets/list_icon.png";
import bellIcon from "../../../assets/bell.png";
import peopleIcon from "../../../assets/people.png";

function AdminHeader() {
  return (
    <header className="admin-header">
      {/* Left side: list/hamburger icon */}
      <div className="header-left">
        <img src={listIcon} alt="Menu" className="menu-icon" />
      </div>

      {/* Right side: notifications + user info */}
      <div className="header-right">
        <img src={bellIcon} alt="Notifications" className="header-icon" />
        <img src={peopleIcon} alt="User" className="header-icon" />
        <span className="user-name">홍길동님</span>
      </div>
    </header>
  );
}

export default AdminHeader;
