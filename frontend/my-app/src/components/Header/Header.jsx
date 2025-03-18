import { Link } from 'react-router-dom';
import React from 'react';
import cart from '../../assets/cart_button.png';
import login from '../../assets/login_button.png';
import logo from '../../assets/logo.png';
import mypage from '../../assets/mypage_button.png';
import search from '../../assets/search.png';
import styles from './Header.module.css';

const Header = () => {
  const handleSearchClick = () => {
    alert('검색버튼 클릭.');
  };

  return (
    <header className={`${styles.header} ${styles.fullWidth}`}>
      <div className={styles.headerContent}>
        <div className={styles.headerMenu}>
          <Link to="/">
            <img src={logo} alt="Logo" className={styles.headerLogo} />
          </Link>
          {/*<Link to="/furnishing" className={styles.headerLink}>
            홈퍼니싱
          </Link>
          <Link to="/interior" className={styles.headerLink}>
            인테리어
          </Link> */}
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="검색어를 입력해 주세요."
            className={styles.searchInput}
          />
          <img
            src={search}
            alt="Search"
            className={styles.searchIcon}
            onClick={handleSearchClick}
          />
        </div>

        <div className={styles.headerIcons}>
          <Link to="/login">
            <img src={login} alt="Login" className={styles.loginIcon} />
          </Link>
          <Link to="/cart">
            <img src={cart} alt="Cart" className={styles.cartIcon} />
          </Link>
          <Link to="/mypage">
            <img src={mypage} alt="Mypage" className={styles.mypageIcon} />
          </Link>
        </div>
      </div>

      <div className={styles.headerBorder}></div>
    </header>
  );
};

export default Header;
