import './MyPage.css';

import MyPageProfileCard from './MyPageProfileCard';
import MyPageReview from './MyPageReview';
import MyPageSidebar from '../../components/MyPageSidebar/MyPageSidebar';
import OrderList from './OrderList';
import OrderManagement from './OrderManagement';
import PageLayout from '../../components/PageLayout/PageLayout';
import ProductInquiry from './ProductInquiry';
import React from 'react';

function MyPage() {
  return (
    <PageLayout>
      <div className="my-page-container">
        <MyPageProfileCard />
        <div className="my-page-lower">
          {/* <MyPageSidebar /> */}
          <div className="my-page-content">
            <OrderManagement />
            <OrderList />
            <MyPageReview />
            <ProductInquiry />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default MyPage;
