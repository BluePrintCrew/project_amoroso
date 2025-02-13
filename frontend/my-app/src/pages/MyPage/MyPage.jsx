import React from "react";
import MyPageSidebar from "../../components/MyPageSidebar/MyPageSidebar";
import "./MyPage.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function MyPage() {
  return (
    <>
      <Header />
      <div className="my-page-container">
        <MyPageSidebar />
        <div className="my-page-content">
          <h1>주문 관리</h1>
          <p>Here you can see your order status, cancellations, etc.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyPage;
