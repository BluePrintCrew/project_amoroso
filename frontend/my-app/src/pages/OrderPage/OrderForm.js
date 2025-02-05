import './OrderForm.css';

import CartSummary from '../../components/CartSummary/CartSummary';
import Header from '../../components/Header/Header';
import React from 'react';

const OrderForm = () => {
  return (
    <div className="order-page">
      <Header />
      <div className="order-form">
        <h1 className="order-title">주문서 작성</h1>
      </div>

      <CartSummary />
    </div>
  );
};

export default OrderForm;
