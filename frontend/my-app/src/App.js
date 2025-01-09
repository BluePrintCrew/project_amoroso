import React from 'react';
import './index.css';

import Header from './components/Header/Header';
import Banner from './components/Banner/Banner';
import CategoryMenu from './components/CategoryMenu/CategoryMenu';
import ProductList from './components/ProductList/ProductList';
import BenefitsSection from './components/BenefitsSection/BenefitsSection';
import MagazineSection from './components/MagazineSection/MagazineSection';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div>
      <Header />
      <Banner />
      <CategoryMenu />
      <ProductList />
      <BenefitsSection />
      <MagazineSection />
      <Footer />i
    </div>
  );
}

export default App;
