import React from "react";
import "./CartFooter.css";

function CartFooter() {
  return (
    <div className="cart-footer"> 
      {/* Right side: Buttons + text phrase beneath them */}
      <div className="cart-footer-buttons">
        <div className="order-buttons">
          <button className="select-order-btn">선택 상품 주문</button>
          <button className="all-order-btn">전체 상품 주문</button>
        </div>


    
      </div>
    </div>
  );
}

export default CartFooter;
