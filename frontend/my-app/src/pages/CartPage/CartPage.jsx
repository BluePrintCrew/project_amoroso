import React from "react";
import CartTable from "./CartTable";
import CartSummary from "../../components/CartSummary/CartSummary";
import CartFooter from "./CartFooter";
import "./CartPage.css";

const cartItems = [
  {
    id: 1,
    name: "식탁의자 1",
    description: "한샘 설치기사",
    price: 3306000,
    originalPrice: 4272000,
    quantity: 1,
    shipping: "무료배송",
    imageUrl: "https://via.placeholder.com/80",
  },
  {
    id: 2,
    name: "식탁의자 2",
    description: "다이닝 의자",
    price: 520000,
    originalPrice: 580000,
    quantity: 1,
    shipping: "유료배송",
    imageUrl: "https://via.placeholder.com/80",
  },
];

function CartPage() {
  return (
    <div className="cart-page">
      
      <h2 className="cart-title">장바구니 ({cartItems.length})</h2>
      <CartTable cartItems={cartItems} />
      <div className="cart-information-text">
        <p>• 주문서 안내 내용입니다. 주문서 안내 내용입니다. 주문서 안내 내용입니다.</p>
        <p>• 주문서 안내 내용입니다. 주문서 안내 내용입니다. 주문서 안내 내용입니다.</p>
        <p>• 주문서 안내 내용입니다. 주문서 안내 내용입니다. 주문서 안내 내용입니다.</p>
        <p>• 주문서 안내 내용입니다. 주문서 안내 내용입니다. 주문서 안내 내용입니다.</p>
      </div>
      <CartSummary cartItems={cartItems} />
      <CartFooter />
    </div>
  );
}

export default CartPage;