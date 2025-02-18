import React from "react";
import "./AdminHeader.css";

// Icon imports
import listIcon from "../../../assets/list_icon.png";
import bellIcon from "../../../assets/bell.png";
import peopleIcon from "../../../assets/people.png";

function AdminHeader() {
  return (
    <header className="admin-header">
      {/* Left: hamburger icon */}
      <div className="header-left">
        <img src={listIcon} alt="Menu" className="menu-icon" />
      </div>

      {/* Right: bell icon + profile icon + user name */}
      <div className="header-right">
        <img src={bellIcon} alt="Notifications" className="header-icon" />
        
        <div className="profile-section">
          <img src={peopleIcon} alt="Profile" className="header-icon" />
          <span className="user-name">홍길동님</span>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
