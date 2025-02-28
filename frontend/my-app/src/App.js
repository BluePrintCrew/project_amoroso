import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Admin from './pages/AdminPage/AdminPage';
import AdminLayout from './components/Admin/AdminLayout/AdminLayout';
import Cart from './pages/CartPage/CartPage';
import Detail from './pages/Product_Detail/ProductDetailPage';
import Home from './pages/MainPage/MainPage';
import Login from './pages/Login/LoginForm';
import MyInfo from './pages/MyPage/MyInfoEdit';
import MyPage from './pages/MyPage/MyPage';
import Order from './pages/OrderPage/OrderForm';
import ProductList from './pages/ProductListPage/ProductListPage';
import Products from './pages/CartPage/CartPage';
import ProductsPage from './pages/AdminPage/ProductsPage/ProductsPage';
import React from 'react';
import SignUp from './pages/SignUp/SignUpPage';

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
          <Route path="/mypageinfo" element={<MyInfo />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
