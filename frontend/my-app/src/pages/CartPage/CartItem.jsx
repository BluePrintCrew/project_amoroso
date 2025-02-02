// src/pages/CartPage/CartItem.jsx
import React from "react";
import "./CartItem.css";

function CartItem({ item }) {
  // item이 undefined일 경우 기본값 설정
  if (!item) {
    return <p className="error-message">잘못된 상품 정보입니다.</p>;
  }

  const { name = "상품 없음", price = 0, discount = 0, shipping = 0 } = item;

  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <p className="cart-item-name">{name}</p>
        <p className="cart-item-price">{price.toLocaleString()}원</p>
        {discount > 0 && (
          <p className="cart-item-discount">할인: -{discount.toLocaleString()}원</p>
        )}
        <p className="cart-item-shipping">배송비: {shipping.toLocaleString()}원</p>
      </div>
    </div>
  );
}

export default CartItem;
