import './MainPage.css'; // 일단 아직 안쓸

import Banner from '../../components/Banner/Banner';
import BenefitsSection from '../../components/BenefitsSection/BenefitsSection';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu';
import HomeProductList from '../../components/HomeProductList/HomeProductList';
import MagazineSection from '../../components/MagazineSection/MagazineSection';
import PageLayout from '../../components/PageLayout/PageLayout';
import React from 'react';

function MainPage() {
  return (
    <PageLayout>
      <Banner />
      <CategoryMenu />
      {/* 메인에서만 쓰는 짧은 추천상품/베스트상품 리스트 */}
      <HomeProductList />
      <BenefitsSection />
      <MagazineSection />
    </PageLayout>
  );
}

export default MainPage;
