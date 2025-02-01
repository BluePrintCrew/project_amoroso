import React from "react";
import "./CartTable.css";

function CartTable({ cartItems = [] }) {
  return (
    <div className="cart-table-container">
      {/* 테이블 헤더 (6열) */}
      <div className="cart-table-header">
        {/* 1) 체크박스 */}
        <div>
          <input type="checkbox" />
        </div>
        {/* 2) 상품정보 */}
        <div>상품정보</div>
        {/* 3) 수량 */}
        <div>수량</div>
        {/* 4) 상품금액 */}
        <div>상품금액</div>
        {/* 5) 배송정보 */}
        <div>배송정보</div>
        {/* 6) 주문하기 */}
        <div>주문하기</div>
      </div>

      {/* 상품 아이템들 */}
      {cartItems.map((item) => (
        <div className="cart-table-row" key={item.id}>
          {/* (1) 체크박스 */}
          <div className="cell-checkbox">
            <input type="checkbox" />
          </div>

          {/* (2) 상품정보 영역 */}
          <div className="cell-product-info">
            <div className="product-thumb">
              <img src={item.imageUrl} alt={item.name} />
            </div>
            <div className="product-details">
              {/* 예: 브랜드명, 설치기사 등 태그 */}
              <div className="product-tags">
                <span>한샘</span>
                <span>설치기사</span>
              </div>
              {/* 상품명 */}
              <div className="product-name">
                {item.name}
              </div>
              {/* 옵션변경 */}
              <button className="option-change-btn">옵션변경</button>
            </div>
          </div>

          {/* (3) 수량 */}
          <div className="cell-quantity">
            <div className="quantity-box">
              <button>-</button>
              <span>{item.quantity}</span>
              <button>+</button>
            </div>
            <button className="apply-button">변경적용</button>
          </div>

          {/* (4) 상품금액 (할인가 + 원래가) */}
          <div className="cell-price">
            <div className="sale-price">
              {item.price.toLocaleString()}원
            </div>
            <div className="original-price">
              {item.originalPrice.toLocaleString()}원
            </div>
          </div>

          {/* (5) 배송정보 */}
          <div className="cell-shipping">
            <div className="shipping-info">무료배송</div>
            <div className="shipping-desc">지역별/옵션별 배송비 추가</div>
            <div className="shipping-desc">지역별 배송비</div>
          </div>

          {/* (6) 주문하기 영역 */}
          <div className="cell-actions">
            <button className="order-now-button">바로주문</button>
            <button className="wishlist-button">찜</button>
            <button className="delete-button">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartTable;
