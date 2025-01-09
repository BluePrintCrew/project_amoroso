import React from 'react';
import './Header.css'; 

function Header() {
  return (
    <header className="header-container">
      <div className="header-logo">Amoroso</div>
      <div className="header-search">
        <input type="text" placeholder="검색어를 입력해주세요" />
      </div>
      <div className="header-icons">
        <button>로그인</button>
        <button>장바구니</button>
      </div>
    </header>
  );
}

export default Header;
