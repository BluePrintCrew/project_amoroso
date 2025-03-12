import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Admin from './pages/AdminPage/AdminPage';
import AdminLayout from './components/Admin/AdminLayout/AdminLayout';
import AdminProductRegister from './pages/AdminPage/AdminProductRegister/AdminProductRegister';
import Cart from './pages/CartPage/CartPage';
import Detail from './pages/Product_Detail/ProductDetailPage';
import Home from './pages/MainPage/MainPage';
import Login from './pages/Login/LoginForm';
import MyInfo from './pages/MyPage/MyInfoEdit';
import MyPage from './pages/MyPage/MyPage';
import OAuth2CallbackPage from './pages/Auth/OAuth2CallbackPage';
import Order from './pages/OrderPage/OrderForm';
import Products from './pages/ProductListPage/ProductListPage';
import ProductsPage from './pages/AdminPage/ProductsPage/ProductsPage';
import React from 'react';
import SignUp from './pages/SignUp/SignUpPage';
import TestJWTProviderPage from './pages/TestPage/TestJWTProviderPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<Detail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/order" element={<Order />} />
          <Route path="/products" element={<Products />} />
          <Route path="/mypage/*" element={<MyPage />} />
          <Route path="/mypageinfo" element={<MyInfo />} />

          {/* OAuth2 콜백 라우트 */}
          <Route path="/oauth2/callback/:provider" element={<OAuth2CallbackPage />} />

          {/* 테스트 시 사용되는 페이지*/}
          <Route path="/testJWTProvider" element={<TestJWTProviderPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="register" element={<AdminProductRegister />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
