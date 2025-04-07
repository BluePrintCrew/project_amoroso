import './CartFooter.css';

import React from 'react';

function CartFooter({ cartItems = [], selectedItems = [], onOrder }) {
  const handleOrderAll = () => {
    if (cartItems.length === 0) return alert('장바구니가 비어있습니다.');
    onOrder(cartItems);
  };

  const handleOrderSelected = () => {
    if (selectedItems.length === 0) return alert('선택한 상품이 없습니다.');
    onOrder(selectedItems);
  };

  return (
    <div className="cart-footer">
      {/* Right side: Buttons + text phrase beneath them */}
      <div className="cart-footer-buttons">
        <div className="order-buttons">
          <button className="select-order-btn" onClick={handleOrderSelected}>
            선택 상품 주문
          </button>
          <button className="all-order-btn" onClick={handleOrderAll}>
            전체 상품 주문
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartFooter;
