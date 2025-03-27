import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import cart from '../../assets/cart_button.png';
import login from '../../assets/login_button.png';
import logo from '../../assets/logo.png';
import mypage from '../../assets/mypage_button.png';
import search from '../../assets/search.png';
import styles from './Header.module.css';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    alert('검색버튼 클릭.');
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
            <Link to="/login">
              <img src={login} alt="Login" className={styles.loginIcon} />
            </Link>
          ) : (
            <>
              <Link to="/cart">
                <img src={cart} alt="Cart" className={styles.cartIcon} />
              </Link>
              <Link to="/mypage">
                <img src={mypage} alt="Mypage" className={styles.mypageIcon} />
              </Link>
              <div 
                onClick={handleLogout} 
                className={styles.logoutButton}
                style={{ cursor: 'pointer' }}
              >
                로그아웃
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