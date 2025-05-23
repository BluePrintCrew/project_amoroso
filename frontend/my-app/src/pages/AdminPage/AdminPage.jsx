import React, { useEffect, useState } from "react";
import AdminCard from "../../components/Admin/AdminCard/AdminCard";
import AdminChart from "../../components/Admin/AdminChart/AdminChart";
import OrderTable from "../../components/Admin/OrderTable/OrderTable";
import TopProducts from "../../components/Admin/TopProducts/TopProducts";
import styles from "./AdminPage.module.css";
import axios from "axios";
import { API_BASE_URL } from "../MyPage/api";

const accessToken = localStorage.getItem("access_token");

function SellerPage() {
  const [data, setData] = useState({
    totalSales: 0,
    orderCount: 0,
    totalProducts: 0,
    inTransitOrders: 0,
  });

  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const fetchData = async () => {
      try {
        const headers = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const [salesRes, orderRes, productRes, statsRes] = await Promise.all([
          axios.get(
            `${API_BASE_URL}/api/v1/sellers/total-sales?year=${year}&month=${month}`,
            headers
          ),
          axios.get(
            `${API_BASE_URL}/api/v1/sellers/total-orders?year=${year}&month=${month}`,
            headers
          ),
          axios.get(`${API_BASE_URL}/api/v1/sellers/total-products`, headers),
          axios.get(`${API_BASE_URL}/api/v1/sellers/stats`, headers),
        ]);

        setData({
          totalSales: salesRes.data.totalSale,
          orderCount: orderRes.data.orderCount,
          totalProducts: productRes.data.totalProducts,
          inTransitOrders: statsRes.data.inTransitOrders,
        });
      } catch (err) {
        console.error("AdminPage fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.mainContent}>
      <div className={styles.topContent}>
        <div className={styles.cardSection}>
          <AdminCard title="총 매출">
            {data.totalSales.toLocaleString()} 원
          </AdminCard>
          <AdminCard title="주문 수">{data.orderCount} 건</AdminCard>
          <AdminCard title="상품 수">{data.totalProducts} 개</AdminCard>
          <AdminCard title="배송 중">{data.inTransitOrders} 건</AdminCard>
        </div>
      </div>
      <div className={styles.middleContent}>
        <div className={styles.chartContainer}>
          <AdminChart />
        </div>
        <div className={styles.productContainer}>
          <TopProducts />
        </div>
      </div>
      <div className={styles.bottomContent}>
        <OrderTable />
      </div>
    </div>
  );
}

export default SellerPage;
