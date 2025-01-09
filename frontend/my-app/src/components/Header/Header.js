import React from "react";
import "./Header.css";
import logo from "../../assets/logo.png";
import search from "../../assets/search.png";
import login from "../../assets/login_button.png";
import cart from "../../assets/cart_button.png";
import mypage from "../../assets/mypage_button.png";

const Header = () => {
  const handleClick = () => {
    alert("검색버튼 클릭.");
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-menu">
          <img src={logo} alt="Logo" className="header-logo" />
          <a href="/furnishing" className="header-link">
            홈퍼니싱
          </a>
          <a href="/interior" className="header-link">
            인테리어
          </a>
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
            onClick={handleClick}
          />
        </div>

        <div className="header-icons">
          <img src={login} alt="Login" className="login-icon" />
          <img src={cart} alt="Cart" className="cart-icon" />
          <img src={mypage} alt="Mypage" className="mypage-icon" />
        </div>
      </div>

      <hr />
    </header>
  );
};

export default Header;
