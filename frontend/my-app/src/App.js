import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login/LoginForm";
import SignUp from "./pages/SignUp/SignUpPage";
import Cart from "./pages/CartPage/CartPage";
import ProductList from "./pages/home/ProductList/ProductList";
import Detail from "./pages/Product_Detail/ProductDetailPage";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
