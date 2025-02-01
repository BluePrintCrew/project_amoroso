import React from "react";
import "./CartTable.css";

function CartTable({ cartItems }) {
  return (
    <div className="cart-table">
      {/* 장바구니 테이블 헤더 */}
      <div className="cart-table-header">
        <input type="checkbox" />
        <span>상품정보</span>
        <span>수량</span>
        <span>상품금액</span>
        <span>배송정보</span>
        <span>주문하기</span>
      </div>

      {/* 장바구니 아이템 목록 */}
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div className="cart-item-row" key={item.id}>
            <input type="checkbox" />
            <div className="cart-item-info">
              <img src={item.imageUrl} alt={item.name} className="cart-item-thumbnail" />
              <div>
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-description">{item.description}</p>
              </div>
            </div>
            <div className="cart-item-quantity">
              <button>-</button>
              <span>{item.quantity}</span>
              <button>+</button>
            </div>
            <div className="cart-item-price">
              <span>{item.price.toLocaleString()}원</span>
              <span className="original-price">{item.originalPrice.toLocaleString()}원</span>
            </div>
            <div className="cart-item-shipping">{item.shipping}</div>
            <div className="cart-item-actions">
              <button className="order-button">바로주문</button>
              <button className="wishlist-button">찜</button>
              <button className="delete-button">✖</button>
            </div>
          </div>
        ))
      ) : (
        <p className="empty-cart">장바구니가 비어 있습니다.</p>
      )}

      {/* 선택상품 삭제 버튼 */}
      <button className="delete-selected">선택상품 삭제</button>
    </div>
  );
}

export default CartTable;
