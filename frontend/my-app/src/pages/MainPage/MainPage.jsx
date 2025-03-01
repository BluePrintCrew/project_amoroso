import Banner from '../../components/Banner/Banner';
import BenefitsSection from '../../components/BenefitsSection/BenefitsSection';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu';
import Header from '../../components/Header/Header';
import HomeProductList from '../../components/HomeProductList/HomeProductList';
import MagazineSection from '../../components/MagazineSection/MagazineSection';
import React from 'react';
import styles from './MainPage.module.css';

function MainPage() {
  return (
    <div className={styles.mainPage}>
      <Banner />
      <Header />
      <div className={styles.content}>
        <CategoryMenu />
      </div>
    </div>
  );
}

export default MainPage;
