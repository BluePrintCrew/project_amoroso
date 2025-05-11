import React from 'react';
import styles from './MainPage.module.css';
import Banner from '../../components/Banner/Banner';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import InfiniteScrollProducts from '../../components/ProductList/InfiniteScrollProducts/InfiniteScrollProducts';
import CategoryNavigation from '../../components/Navigation/CategoryNavigation/CategoryNavigation';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu';
import BestProducts from '../../components/BestProducts/BestProducts';
import { useNavigate } from 'react-router-dom';

// 카테고리 맵핑 (ProductListPage에서 가져온 것)
const categoryMap = {
  '거실': [
    { label: '소파', value: 'LIV_SOFA' },
    { label: '장식장', value: 'LIV_DISPLAY' },
    { label: '탁자', value: 'LIV_TABLE' },
  ],
  '침실': [
    { label: '침대', value: 'BED_BED' },
    { label: '침대 깔판', value: 'BED_BASE' },
    { label: '협탁', value: 'BED_NIGHTSTAND' },
  ],
  '주방': [
    { label: '식탁 & 의자', value: 'KIT_DINING' },
  ],
  '사무실': [
    { label: '책상', value: 'OFF_DESK' },
    { label: '의자', value: 'OFF_CHAIR' },
    { label: '책장', value: 'OFF_BOOKSHELF' },
  ],
  '드레스룸': [
    { label: '장롱', value: 'DRESS_WARDROBE' },
    { label: '화장대', value: 'DRESS_TABLE' },
    { label: '드레스', value: 'DRESS_DRESSER' },
    { label: '서랍장', value: 'DRESS_DRAWER' },
  ],
  '기타': [
    { label: '소품', value: 'ETC_DECOR' },
    { label: '벽걸이 거울', value: 'ETC_WALL_MIRROR' },
    { label: '액세서리', value: 'ETC_ACCESSORY' },
    { label: '거울', value: 'ETC_GENERAL_MIRROR' },
  ],
};

function MainPage() {
  // 모든 카테고리를 하나의 배열로 평탄화
  const allCategories = Object.values(categoryMap).flat();
  const navigate = useNavigate();

  return (
    <div className={styles.mainPage}>
      <Header />
      <Banner />
      <div className={styles.content}>
        <CategoryMenu />
        <BestProducts />

        {/* Amoroso Products 섹션 */}
        <div className={styles.productsHeader}>
          <h2 className={styles.productsTitle}>Amoroso Products</h2>
          <button className={styles.productsMoreBtn} onClick={() => navigate('/productlist')}>
            더보기 &gt;
          </button>
        </div>
        {/* 상품 리스트 예시: 전체 상품 보여주기 */}
        <InfiniteScrollProducts />
        {/* 기존 카테고리별 섹션은 필요시 유지/삭제 */}
        {/*
        {allCategories.map(category => (
          <section 
            key={category.value}
            id={`category-${category.value}`}
            className={styles.categorySection}
          >
            <InfiniteScrollProducts categoryCode={category.value} />
          </section>
        ))}
        */}
        {/* 카테고리 네비게이션 */}
        <CategoryNavigation categoryMap={categoryMap} />
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;
