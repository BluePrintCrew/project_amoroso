import React, { useEffect, useState } from "react";
import axios from "axios";
import CartTable from "./CartTable";
import CartSummary from "../../components/CartSummary/CartSummary";
import CartFooter from "./CartFooter";
import "./CartPage.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/cart")
      .then((response) => {
        setCartItems(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>데이터를 불러오는 중 오류 발생</div>;

  return (
    <div className="cart-page">
      <Header />
      <h2 className="cart-title">장바구니 ({cartItems.length})</h2>
      <CartTable cartItems={cartItems} setCartItems={setCartItems} />
      <div className="cart-information-text">
        <p>• 주문서 안내 내용입니다. 주문서 안내 내용입니다. 주문서 안내 내용입니다.</p>
        <p>• 주문서 안내 내용입니다. 주문서 안내 내용입니다. 주문서 안내 내용입니다.</p>
        <p>• 주문서 안내 내용입니다. 주문서 안내 내용입니다. 주문서 안내 내용입니다.</p>
        <p>• 주문서 안내 내용입니다. 주문서 안내 내용입니다. 주문서 안내 내용입니다.</p>
      </div>
      <CartSummary cartItems={cartItems} />
      <CartFooter />
      <Footer />
    </div>
  );
}

export default CartPage;
