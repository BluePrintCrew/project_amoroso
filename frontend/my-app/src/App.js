import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/home/Home";
import Login from "./pages/Login/LoginForm";
import Detail from "./pages/Product_Detail/ProductDetailPage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
