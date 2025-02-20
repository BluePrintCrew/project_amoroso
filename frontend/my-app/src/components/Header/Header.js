import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.png";
import search from "../../assets/search.png";
import login from "../../assets/login_button.png";
import cart from "../../assets/cart_button.png";
import mypage from "../../assets/mypage_button.png";

const Header = () => {
  const handleSearchClick = () => {
    alert("검색버튼 클릭.");
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-menu">
          <Link to="/">
            <img src={logo} alt="Logo" className="header-logo" />
          </Link>
          <Link to="/furnishing" className="header-link">
            홈퍼니싱
          </Link>
          <Link to="/interior" className="header-link">
            인테리어
          </Link>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="검색어를 입력해 주세요."
            className="search-input"
          />
          <img
            src={search}
            alt="Search"
            className="search-icon"
            onClick={handleSearchClick}
          />
        </div>

        <div className="header-icons">
          <Link to="/login">
            <img src={login} alt="Login" className="login-icon" />
          </Link>
          <Link to="/cart">
            <img src={cart} alt="Cart" className="cart-icon" />
          </Link>
          <Link to="/mypage">
            <img src={mypage} alt="Mypage" className="mypage-icon" />
          </Link>
        </div>
      </div>

      <hr />
    </header>
  );
};

export default Header;
