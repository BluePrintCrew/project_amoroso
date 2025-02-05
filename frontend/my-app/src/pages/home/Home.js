import React from "react";
import "../../index.css";

import Header from "../../components/Header/Header";
import Banner from "./Banner/Banner";
import CategoryMenu from "./CategoryMenu/CategoryMenu";
import ProductList from "./ProductList/ProductList";
import BenefitsSection from "./BenefitsSection/BenefitsSection";
import MagazineSection from "./MagazineSection/MagazineSection";
import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <div>
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

export default Home;
