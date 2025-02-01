import React from "react";
import "./CartFooter.css";

function CartFooter() {
  return (
    <div className="cart-footer">
      <button className="order-button">선택 상품 주문</button>
      <button className="order-button">전체 상품 주문</button>
    </div>
  );
}

export default CartFooter;
