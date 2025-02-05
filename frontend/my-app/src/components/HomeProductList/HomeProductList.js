// src/components/HomeProductList/HomeProductList.js
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './HomeProductList.css';

// 예시 더미 데이터 (베스트상품 4개)
const homeDummyProducts = [
  { id: 1, name: '베스트상품 1', price: 473000, discount: 18 },
  { id: 2, name: '베스트상품 2', price: 473000, discount: 18 },
  { id: 3, name: '베스트상품 3', price: 473000, discount: 18 },
  { id: 4, name: '베스트상품 4', price: 473000, discount: 18 },
];

function HomeProductList() {
  return (
    <section className="home-product-list">
      <h3 className="home-product-title">Amoroso Best</h3>

      <div className="home-product-grid">
        {homeDummyProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}

export default HomeProductList;
