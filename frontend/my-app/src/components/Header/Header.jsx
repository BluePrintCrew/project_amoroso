import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import cart from '../../assets/svg/cart_button.svg';
import login from '../../assets/svg/log_in.svg';
import logo from '../../assets/svg/logo.svg';
import logout from '../../assets/svg/logout.svg';
import mypage from '../../assets/svg/mypage_button.svg';
import search from '../../assets/svg/search.svg';
import sellerLogin from '../../assets/svg/seller_login.svg';
import styles from './Header.module.css';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트 마운트 시 access_token 존재 여부 확인
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    };

    // 초기 확인
    checkAuth();

    // 토큰 변경을 처리하기 위한 스토리지 이벤트 리스너 등록
    window.addEventListener('storage', checkAuth);

    // 클린업
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      // 검색어를 /products 경로로 리디렉션
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    navigate('/');
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <img
            src={search}
            alt="Search"
            className={styles.searchIcon}
            onClick={handleSearchClick}
          />
        </div>
        <div className={styles.headerIcons}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className={styles.iconWithLabel}>
                <img src={login} alt="Login" className={styles.navIcon} />
                <span className={styles.iconLabel}>로그인</span>
              </Link>
              <Link to="/admin/login" className={styles.iconWithLabel}>
                <img
                  src={sellerLogin}
                  alt="SellerLogin"
                  className={styles.navIcon}
                />
                <span className={styles.iconLabel}>판매자 로그인</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/cart" className={styles.iconWithLabel}>
                <img src={cart} alt="Cart" className={styles.navIcon} />
                <span className={styles.iconLabel}>장바구니</span>
              </Link>
              <Link to="/mypage" className={styles.iconWithLabel}>
                <img src={mypage} alt="Mypage" className={styles.navIcon} />
                <span className={styles.iconLabel}>마이페이지</span>
              </Link>
              <div onClick={handleLogout} className={styles.iconWithLabel}>
                <img src={logout} alt="Logout" className={styles.navIcon} />
                <span className={styles.iconLabel}>로그아웃</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.headerBorder}></div>
    </header>
  );
};

export default Header;
