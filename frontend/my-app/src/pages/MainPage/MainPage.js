import React from 'react';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu';
import BenefitsSection from '../../components/BenefitsSection/BenefitsSection';
import MagazineSection from '../../components/MagazineSection/MagazineSection';
import HomeProductList from '../../components/HomeProductList/HomeProductList';
import Footer from '../../components/Footer/Footer';

import './MainPage.css'; // 일단 아직 안쓸

function MainPage() {
  return (
    <div className="main-page">
      <Header />
      <Banner />
      <CategoryMenu />
      {/* 메인에서만 쓰는 짧은 추천상품/베스트상품 리스트 */}
      <HomeProductList />  
      <BenefitsSection />
      <MagazineSection />
      <Footer />
    </div>
  );
}

export default MainPage;
