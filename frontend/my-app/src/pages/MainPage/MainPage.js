import React from 'react';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu';
import ProductList from '../../components/ProductList/ProductList';
import BenefitsSection from '../../components/BenefitsSection/BenefitsSection';
import MagazineSection from '../../components/MagazineSection/MagazineSection';
import Footer from '../../components/Footer/Footer';

import './MainPage.css'; // 일단 아직 안쓸

function MainPage() {
  return (
    <div className="main-page">
      <Header />
      <Banner />
      <CategoryMenu />
      <ProductList />
      <BenefitsSection />
      <MagazineSection />
      <Footer />
    </div>
  );
}

export default MainPage;
