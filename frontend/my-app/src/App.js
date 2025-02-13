import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Cart from './pages/CartPage/CartPage';
import Detail from './pages/Product_Detail/ProductDetailPage';
import Home from './pages/home/Home';
import Login from './pages/Login/LoginForm';
import Order from './pages/OrderPage/OrderForm';
import ProductList from './pages/home/ProductList/ProductList';
import React from 'react';
import SignUp from './pages/SignUp/SignUpPage';
import Products from './pages/CartPage/CartPage';
import MyPage from "./pages/MyPage/MyPage";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/list" element={<ProductList />} />
          <Route path="/order" element={<Order />} />
          <Route path="/products" element={<Products />} />
          <Route path="/mypage/*" element={<MyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
