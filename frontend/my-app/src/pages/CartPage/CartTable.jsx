import "./CartTable.css";

import React, { useEffect, useState } from "react";

import { API_BASE_URL } from "../MyPage/api";
import axios from "axios";

function CartTable({ cartItems, setCartItems, onSelectionChange }) {
  // 선택된 상품 ID들을 관리 (체크박스용)
  const [selectedItems, setSelectedItems] = useState([]);

  // 초기 선택 상태: 모든 상품 선택
  useEffect(() => {
    const allIds = cartItems.map((item) => item.id);
    setSelectedItems(allIds);
    onSelectionChange(allIds);
  }, [cartItems]);

  // 토큰 가져오기
  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  // 이미지 URL 처리 함수
  const getImageUrl = (item) => {
    // 디버깅을 위해 이미지 관련 데이터 확인
    console.log("상품 이미지 데이터:", {
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      primaryImageURL: item.primaryImageURL,
      item: item,
    });

    // 가능한 모든 이미지 필드 확인
    const possibleImageUrl =
      item.imageUrl || item.primaryImageURL || item.mainImageURL || "";

    // 이미지 URL이 없는 경우 기본 이미지 반환
    if (!possibleImageUrl) return "https://placehold.co/100x100";

    // URL 형식 처리
    if (possibleImageUrl.startsWith("http")) {
      return possibleImageUrl;
    } else if (possibleImageUrl.startsWith("/images/")) {
      // 파일명만 추출하여 API 엔드포인트에 추가
      const filename = possibleImageUrl.split("/").pop();
      return `${API_BASE_URL}/api/v1/images/${filename}`;
    } else if (possibleImageUrl.startsWith("/api/")) {
      // 이미 API 경로인 경우
      return `${API_BASE_URL}${possibleImageUrl}`;
    } else if (possibleImageUrl.startsWith("/")) {
      // 다른 형식의 절대 경로
      return `${API_BASE_URL}${possibleImageUrl}`;
    } else {
      // 파일명만 있는 경우
      return `${API_BASE_URL}/api/v1/images/${possibleImageUrl}`;
    }
  };

  // 개별 체크박스 변경 핸들러
  const handleCheckboxChange = (itemId, isChecked) => {
    // if (isChecked) {
    //   setSelectedItems((prev) => [...prev, itemId]);
    // } else {
    //   setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    // }
    const updated = isChecked
      ? [...selectedItems, itemId]
      : selectedItems.filter((id) => id !== itemId);
    setSelectedItems(updated);
    onSelectionChange(updated);
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = (isChecked) => {
    // if (isChecked) {
    //   setSelectedItems(cartItems.map((item) => item.id));
    // } else {
    //   setSelectedItems([]);
    // }
    const updated = isChecked ? cartItems.map((item) => item.id) : [];
    setSelectedItems(updated);
    onSelectionChange(updated);
  };

  // 수량 업데이트 핸들러
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const token = getToken();
    if (!token) {
      console.error("로그인이 필요합니다.");
      return;
    }

    axios
      .put(
        `${API_BASE_URL}/api/v1/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("수량 업데이트 성공:", response.data);
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch((error) => {
        console.error("수량 업데이트 오류: ", error);
        alert("수량 업데이트에 실패했습니다.");
      });
  };

  // 개별 삭제 핸들러
  const handleDelete = (itemId) => {
    const token = getToken();
    if (!token) {
      console.error("로그인이 필요합니다.");
      return;
    }

    axios
      .delete(`${API_BASE_URL}/api/v1/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
        setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      })
      .catch((error) => {
        console.error("삭제 오류: ", error);
        alert("상품 삭제에 실패했습니다.");
      });
  };

  // 선택 상품 일괄 삭제 핸들러
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    const token = getToken();
    if (!token) {
      console.error("로그인이 필요합니다.");
      return;
    }

    const deleteRequests = selectedItems.map((itemId) =>
      axios.delete(`${API_BASE_URL}/api/v1/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    Promise.all(deleteRequests)
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => !selectedItems.includes(item.id))
        );
        setSelectedItems([]);
      })
      .catch((error) => {
        console.error("일괄 삭제 오류: ", error);
        alert("선택한 상품 삭제에 실패했습니다.");
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
            checked={
              selectedItems.length === cartItems.length && cartItems.length > 0
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        </div>
        <div>상품정보</div>
        <div>수량</div>
        <div>상품금액</div>
        <div>배송정보</div>
        <div></div>
      </div>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <div className="empty-cart-message">장바구니에 상품이 없습니다.</div>
      ) : (
        cartItems.map((item) => (
          <div className="cart-table-row" key={item.id}>
            {/* Checkbox */}
            <div className="cell-checkbox">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={(e) =>
                  handleCheckboxChange(item.id, e.target.checked)
                }
              />
            </div>

            {/* 상품정보 */}
            <div className="cell-product-info">
              <div className="product-thumb">
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                  onError={(e) => {
                    console.error(`이미지 로드 실패: ${getImageUrl(item)}`);
                    e.target.src = "https://placehold.co/100x100";
                  }}
                />
              </div>
              <div className="product-details">
                <div className="product-tags">
                  {item.additionalOptionName && (
                    <span>{item.additionalOptionName}</span>
                  )}
                  {item.productOptionName && (
                    <span>{item.productOptionName}</span>
                  )}
                </div>
                <div className="product-name">{item.name}</div>
                {item.selectedOptionValue && (
                  <div className="product-option">
                    옵션: {item.selectedOptionValue}
                  </div>
                )}
                <button className="option-change-btn">옵션변경</button>
              </div>
            </div>

            {/* 수량 */}
            <div className="cell-quantity">
              <div className="quantity-box">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <button
                className="apply-button"
                onClick={() => handleQuantityChange(item.id, item.quantity)}
              >
                변경적용
              </button>
            </div>

            {/* 상품금액 */}
            <div className="cell-price">
              <div className="sale-price">{item.price.toLocaleString()}원</div>
              {item.originalPrice > item.price && (
                <div className="original-price">
                  {item.originalPrice.toLocaleString()}원
                </div>
              )}
            </div>

            {/* 배송정보 */}
            <div className="cell-shipping">
              <div className="shipping-info">{item.shipping}</div>
              <div className="shipping-desc">지역별/옵션별 배송비 추가</div>
              <div className="shipping-desc">지역별 배송비</div>
            </div>

            {/* 주문하기 (바로주문, 찜, 삭제) */}
            <div className="cell-actions">
              {/* <button className="order-now-button">바로주문</button>
              <button className="wishlist-button">찜</button> */}
              <button
                className="delete-button"
                onClick={() => handleDelete(item.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))
      )}

      {/* Footer */}
      {/* {cartItems.length > 0 && (
        <div className="cart-footer">
          <button className="bulk-delete-btn" onClick={handleBulkDelete}>
            선택상품 삭제
          </button>
        </div>
      )} */}
    </div>
  );
}

export default CartTable;
