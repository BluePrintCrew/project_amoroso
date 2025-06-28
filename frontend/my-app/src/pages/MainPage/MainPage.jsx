import React, { useState, useEffect } from 'react';
import styles from './MainPage.module.css';
import Banner from '../../components/Banner/Banner';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CategoryNavigation from '../../components/Navigation/CategoryNavigation/CategoryNavigation';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu';
import BestProducts from '../../components/BestProducts/BestProducts';
import ProductSection from '../../components/ProductSection/ProductSection';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// 카테고리 맵핑 (ProductListPage에서 가져온 것)
const categoryMap = {
  '거실': [
    { label: '소파', value: 'LIVING_SOFA' },
    { label: '장식장', value: 'LIVING_DISPLAY_CABINET' },
    { label: '탁자', value: 'LIVING_TABLE' },
  ],
  '침실': [
    { label: '침대', value: 'BEDROOM_BED' },
    { label: '침대 깔판', value: 'BEDROOM_BED_BASE' },
    { label: '협탁', value: 'BEDROOM_NIGHTSTAND' },
  ],
  '주방': [
    { label: '식탁 & 의자', value: 'KITCHEN_DINING_SET' },
  ],
  '사무실': [
    { label: '책상', value: 'OFFICE_DESK' },
    { label: '의자', value: 'OFFICE_CHAIR' },
    { label: '책장', value: 'OFFICE_BOOKSHELF' },
  ],
  '드레스룸': [
    { label: '장롱', value: 'DRESSING_WARDROBE' },
    { label: '화장대', value: 'DRESSING_TABLE' },
    { label: '드레스', value: 'DRESSING_DRESSER' },
    { label: '서랍장', value: 'DRESSING_DRAWER' },
  ],
  '기타': [
    { label: '소품', value: 'ETC_DECORATION' },
    { label: '벽걸이 거울', value: 'ETC_WALL_MIRROR' },
    { label: '액세서리', value: 'ETC_ACCESSORY' },
    { label: '거울', value: 'ETC_GENERAL_MIRROR' },
  ],
};

function MainPage() {
  const [products, setProducts] = useState([]);
  const allCategories = Object.values(categoryMap).flat();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/products/`);
        setProducts(res.data.products.slice(0, 8)); // 최대 8개 상품 표시
      } catch (err) {
        console.error('상품 불러오기 실패:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className={styles.mainPage}>
      <Header />
      <Banner />
      <div className={styles.content}>
        <CategoryMenu />
        <BestProducts />

        {/* Amoroso Products 섹션 */}
        <ProductSection
          title="Amoroso Products"
          products={products}
          showMoreLink="/products"
          gridColumns={4}
        />

        {/* 동작하지 않는 관계로 주석 처리 */}
        {/* 카테고리 네비게이션 */}
        {/* <CategoryNavigation categoryMap={categoryMap} /> */}
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;
