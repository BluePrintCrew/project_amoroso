import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumb.css";
import homeIcon from "../../assets/nav_home.png";

const Breadcrumb = () => {
  return (
    <div className="breadcrumb">
      <Link to="/" className="breadcrumb-link">
        <img src={homeIcon} alt="홈" className="breadcrumb-icon" />
      </Link>
      <span className="breadcrumb-separator">&gt;</span>
      <Link to="/products?top=LIVING" className="breadcrumb-link">
        거실
      </Link>
      <span className="breadcrumb-separator">&gt;</span>
      <Link to="/products?top=LIVING&sub=LIVING_TABLE" className="breadcrumb-link">
        식탁의자
      </Link>
    </div>
  );
};

export default Breadcrumb;
