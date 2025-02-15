import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MyPageSidebar from "../../components/MyPageSidebar/MyPageSidebar";
import MyPageProfileCard from "./MyPageProfileCard";
import OrderManagement from "./OrderManagement"; // <-- import your new component
import "./MyPage.css";

function MyPage() {
  return (
    <>
      <Header />

      {/* Profile card at the top (full width) */}
      <MyPageProfileCard />

      {/* Lower section: sidebar on the left, main content on the right */}
      <div className="my-page-lower">
        <MyPageSidebar />

        <div className="my-page-content">
          {/* Insert the OrderManagement component here */}
          <OrderManagement />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MyPage;
