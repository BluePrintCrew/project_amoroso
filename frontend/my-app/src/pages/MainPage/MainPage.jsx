import Banner from '../../components/Banner/Banner';
import BenefitsSection from '../../components/BenefitsSection/BenefitsSection';
import BestProducts from '../../components/BestProducts/BestProducts';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu';
import Header from '../../components/Header/Header';
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
        <BestProducts />
      </div>
    </div>
  );
}

export default MainPage;
