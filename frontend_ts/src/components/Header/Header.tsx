import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    const syncAuthState = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(Boolean(token));
    };

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === 'access_token') {
        syncAuthState();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncAuthState();
      }
    };

    syncAuthState();
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = searchQuery.trim();
    if (!keyword) {
      return;
    }
    navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
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
        </div>
        <form className={styles.searchBar} onSubmit={handleSearchSubmit} role="search">
          <input
            type="search"
            placeholder="검색어를 입력해 주세요."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button type="submit" className={styles.searchButton} aria-label="Search">
            <img src={search} alt="Search" className={styles.searchIcon} />
          </button>
        </form>
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
              <button
                type="button"
                onClick={handleLogout}
                className={`${styles.iconWithLabel} ${styles.iconButton}`}
              >
                <img src={logout} alt="Logout" className={styles.navIcon} />
                <span className={styles.iconLabel}>로그아웃</span>
              </button>
            </>
          )}
        </div>
      </div>
      <div className={styles.headerBorder}></div>
    </header>
  );
};

export default Header;
