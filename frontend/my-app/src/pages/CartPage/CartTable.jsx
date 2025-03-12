import React, { useState, useEffect } from "react";
import "./CartTable.css";
import axios from "axios";

function CartTable({ cartItems, setCartItems }) {
  // 선택된 상품 ID들을 관리 (체크박스용)
  const [selectedItems, setSelectedItems] = useState([]);

  // 초기 선택 상태: 모든 상품 선택
  useEffect(() => {
    setSelectedItems(cartItems.map(item => item.id));
  }, [cartItems]);

  // 개별 체크박스 변경 핸들러
  const handleCheckboxChange = (itemId, isChecked) => {
    if (isChecked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // 수량 업데이트 핸들러
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    axios
      .put(`http://localhost:8080/api/v1/cart/${itemId}`, { quantity: newQuantity })
      .then(() => {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch(error => {
        console.error("수량 업데이트 오류: ", error);
      });
  };

  // 개별 삭제 핸들러
  const handleDelete = (itemId) => {
    axios
      .delete(`http://localhost:8080/api/v1/cart/${itemId}`)
      .then(() => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        setSelectedItems(prev => prev.filter(id => id !== itemId));
      })
      .catch(error => {
        console.error("삭제 오류: ", error);
      });
  };

  // 선택 상품 일괄 삭제 핸들러
  const handleBulkDelete = () => {
    Promise.all(
      selectedItems.map(itemId =>
        axios.delete(`http://localhost:8080/api/v1/cart/${itemId}`)
      )
    )
      .then(() => {
        setCartItems(prevItems => prevItems.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
      })
      .catch(error => {
        console.error("일괄 삭제 오류: ", error);
      });
  };

  return (
    <div className="cart-container">
      {/* Divider */}
      <div className="cart-divider"></div>

      {/* Table Header */}
      <div className="cart-table-header">
        <div className="header-checkbox">
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={selectedItems.length === cartItems.length && cartItems.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
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
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
            />
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
              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
            </div>
            <button className="apply-button" onClick={() => handleQuantityChange(item.id, item.quantity)}>변경적용</button>
          </div>

          {/* 상품금액 */}
          <div className="cell-price">
            <div className="sale-price">{item.price.toLocaleString()}원</div>
            <div className="original-price">{item.originalPrice.toLocaleString()}원</div>
          </div>

          {/* 배송정보 */}
          <div className="cell-shipping">
            <div className="shipping-info">{item.shipping}</div>
            <div className="shipping-desc">지역별/옵션별 배송비 추가</div>
            <div className="shipping-desc">지역별 배송비</div>
          </div>

          {/* 주문하기 (바로주문, 찜, 삭제) */}
          <div className="cell-actions">
            <button className="order-now-button">바로주문</button>
            <button className="wishlist-button">찜</button>
            <button className="delete-button" onClick={() => handleDelete(item.id)}>✕</button>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="cart-footer">
        <button className="bulk-delete-btn" onClick={handleBulkDelete}>
          선택상품 삭제
        </button>
      </div>
    </div>
  );
}

export default CartTable;
