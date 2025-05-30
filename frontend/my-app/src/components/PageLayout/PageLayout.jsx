import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './PageLayout.module.css';

const PageLayout = ({ children }) => {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
