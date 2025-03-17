import React from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import MyPageSidebar from "../../components/MyPageSidebar/MyPageSidebar";
import MyPageProfileCard from "./MyPageProfileCard";
import OrderManagement from "./OrderManagement";
import MyPageReview from "./MyPageReview";
import ProductInquiry from "./ProductInquiry";
import "./MyPage.css";

function MyPage() {
  return (
    <PageLayout>
    
      <div className="my-page-container">
        <MyPageProfileCard />
        <div className="my-page-lower">
          {/* <MyPageSidebar /> */}
          <div className="my-page-content">
            <OrderManagement />
            <MyPageReview />
            <ProductInquiry />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default MyPage;