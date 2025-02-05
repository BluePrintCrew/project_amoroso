import React from "react";
import "./CartTable.css";

function CartTable({ cartItems = [] }) {
  return (
    <div className="cart-container">


      {/* Divider */}
      <div className="cart-divider"></div>

      {/* Table Header */}
      <div className="cart-table-header">
        <div className="header-checkbox">
          <input type="checkbox" className="custom-checkbox" />
        </div>
        <div>상품정보</div>
        <div>수량</div>
        <div>상품금액</div>
        <div>배송정보</div>
        <div>주문하기</div>
      </div>

      {/* Cart Items */}
      {cartItems.map((item) => (
        <div className="cart-table-row" key={item.id}>
          {/* Checkbox */}
          <div className="cell-checkbox">
            <input type="checkbox" className="custom-checkbox" defaultChecked />
          </div>

          {/* 상품정보 */}
          <div className="cell-product-info">
            <div className="product-thumb">
              <img src={item.imageUrl} alt={item.name} />
            </div>
            <div className="product-details">
              <div className="product-tags">
                <span>한샘</span>
                <span>설치기사</span>
              </div>
              <div className="product-name">
                {item.name} {item.name} {item.name} {item.name}
              </div>
              <button className="option-change-btn">옵션변경</button>
            </div>
          </div>

          {/* 수량 */}
          <div className="cell-quantity">
            <div className="quantity-box">
              <button>-</button>
              <span>{item.quantity}</span>
              <button>+</button>
            </div>
            <button className="apply-button">변경적용</button>
          </div>

          {/* 상품금액 */}
          <div className="cell-price">
            <div className="sale-price">{item.price.toLocaleString()}원</div>
            <div className="original-price">
              {item.originalPrice.toLocaleString()}원
            </div>
          </div>

          {/* 배송정보 */}
          <div className="cell-shipping">
            <div className="shipping-info">무료배송</div>
            <div className="shipping-desc">지역별/옵션별 배송비 추가</div>
            <div className="shipping-desc">지역별 배송비</div>
          </div>

          {/* 주문하기 (바로주문, 찜, 삭제) */}
          <div className="cell-actions">
            <button className="order-now-button">바로주문</button>
            <button className="wishlist-button">찜</button>
            <button className="delete-button">✕</button>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="cart-footer">
        <button className="bulk-delete-btn">선택상품 삭제</button>
      </div>
    </div>
  );
}

export default CartTable;
