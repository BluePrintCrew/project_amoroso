import React from "react";
import "./Breadcrumb.css";
import homeIcon from "../../assets/nav_home.png";

const Breadcrumb = () => {
  return (
    <div className="breadcrumb">
      <a href="#" className="breadcrumb-link">
        <img src={homeIcon} alt="홈" className="breadcrumb-icon" />
      </a>
      <span className="breadcrumb-separator">&gt;</span>
      <a href="#" className="breadcrumb-link">
        거실
      </a>
      <span className="breadcrumb-separator">&gt;</span>
      <a href="#" className="breadcrumb-link">
        식탁의자
      </a>
    </div>
  );
};

export default Breadcrumb;
