import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import React, { useState } from "react";
import ErrorPopup from "./components/ErrorPopup/ErrorPopup";

import Admin from "./pages/AdminPage/AdminPage";
import AdminTest from "./pages/AdminPage/AdminPageTest";
import AdminLayout from "./components/Admin/AdminLayout/AdminLayout";
import AdminProductRegister from "./pages/AdminPage/AdminProductRegister/AdminProductRegister";
import Cart from "./pages/CartPage/CartPage";
import Detail from "./pages/Product_Detail/ProductDetailPage";
import Home from "./pages/MainPage/MainPage";
import Login from "./pages/Login/LoginForm";
import LoginSuccess from "./pages/Login/LoginSuccess";
import MyInfo from "./pages/MyPage/MyInfoEdit";
import MyPage from "./pages/MyPage/MyPage";
import Order from "./pages/OrderPage/OrderForm";
import OrderTest from "./pages/OrderPage/OrderFormTest";
import Products from "./pages/ProductListPage/ProductListPage";
import ProductsPage from "./pages/AdminPage/ProductsPage/ProductsPage";
import SignUp from "./pages/SignUp/SignUpPage";
import TestJWTProviderPage from "./pages/TestPage/TestJWTProviderPage";
import OrderListPage from "./pages/AdminPage/OrderListPage";
import SellerLoginForm from "./pages/Login/SellerLoginForm";
import SellerSignUpPage from "./pages/SignUp/SellerSignUpPage";
import OrderDetail from "./pages/OrderPage/OrderDetail";

function App() {
  const [showError, setShowError] = useState(false);
  return (
    <Router>
      <div>
        {/* ErrorPopup 테스트용 임시 버튼 및 팝업 *
        <button style={{position:'fixed',top:20,right:20,zIndex:10000}} onClick={() => setShowError(true)}>에러팝업 테스트</button>
        {showError && (
          <ErrorPopup
            message="백엔드에서 내려온 에러 메시지 예시입니다.\n이곳에 실제 에러 메시지가 표시됩니다."
            onClose={() => setShowError(false)}
          />
        )}
        */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loginSuccess" element={<LoginSuccess />} />
          <Route path="/product/:id" element={<Detail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/order" element={<Order />} />
          <Route path="/products" element={<Products />} />
          <Route path="/mypage/*" element={<MyPage />} />
          <Route path="/mypageinfo" element={<MyInfo />} />

          {/* 테스트 시  사용되는 페이지*/}
          <Route path="/adminTest" element={<AdminTest />} />
          <Route path="/testJWTProvider" element={<TestJWTProviderPage />} />
          <Route path="/orderTest" element={<OrderTest />} />

          <Route path="admin/login" element={<SellerLoginForm />} />
          <Route path="admin/signup" element={<SellerSignUpPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="register" element={<AdminProductRegister />} />
            <Route path="order-list" element={<OrderListPage />} />
          </Route>

          <Route path="/order-detail/:orderId" element={<OrderDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
