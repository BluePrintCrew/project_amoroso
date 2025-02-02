import React from "react";
import "./ProductList.css";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const navigate = useNavigate();

  // 더미 상품 데이터
  const amorosoBest = [
    { id: 1, name: "베스트상품 1", price: 473000, discount: 18 },
    { id: 2, name: "베스트상품 2", price: 473000, discount: 18 },
    { id: 3, name: "베스트상품 3", price: 473000, discount: 18 },
    { id: 4, name: "베스트상품 4", price: 473000, discount: 18 },
  ];

  const suggestions = [
    { id: 5, name: "제안상품 1", price: 473000, discount: 18 },
    { id: 6, name: "제안상품 2", price: 473000, discount: 18 },
    { id: 7, name: "제안상품 3", price: 473000, discount: 18 },
    { id: 8, name: "제안상품 4", price: 473000, discount: 18 },
  ];

  const renderProduct = (product) => {
    return (
      <div className="product-card" key={product.id}>
        <div className="product-name">{product.name}</div>
        <div className="product-price">{product.price.toLocaleString()}원</div>
        <div className="product-discount">{product.discount}%</div>
        <button className="detail-button" onClick={() => navigate("/detail")}>
          상세보기
        </button>
      </div>
    );
  };

  return (
    <section className="product-section">
      <h3>Amoroso Best</h3>
      <div className="product-grid">
        {amorosoBest.map((item) => renderProduct(item))}
      </div>

      <h3>Amoroso의 제안상품</h3>
      <div className="product-grid">
        {suggestions.map((item) => renderProduct(item))}
      </div>
    </section>
  );
}

export default ProductList;
