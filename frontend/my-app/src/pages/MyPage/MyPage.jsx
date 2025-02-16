import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MyPageSidebar from "../../components/MyPageSidebar/MyPageSidebar";
import MyPageProfileCard from "./MyPageProfileCard";
import OrderManagement from "./OrderManagement";
import MyPageReview from "./MyPageReview";
import ProductInquiry from "./ProductInquiry";
import "./MyPage.css";

function MyPage() {
  return (
    <>
      <Header />
      <MyPageProfileCard />

      <div className="my-page-lower">
        <MyPageSidebar />
        <div className="my-page-content">
          <OrderManagement />
          <MyPageReview />
          
          {/* Put ProductInquiry right below MyPageReview */}
          <ProductInquiry />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MyPage;
