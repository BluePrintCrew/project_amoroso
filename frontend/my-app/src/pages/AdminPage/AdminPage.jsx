import React, { useEffect, useState } from "react";
import AdminCard from "../../components/Admin/AdminCard/AdminCard";
import AdminChart from "../../components/Admin/AdminChart/AdminChart";
import OrderTable from "../../components/Admin/OrderTable/OrderTable";
import TopProducts from "../../components/Admin/TopProducts/TopProducts";
import styles from "./AdminPage.module.css";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const accessToken = localStorage.getItem("access_token");

function SellerPage() {
  const [data, setData] = useState({
    totalSales: 0,
    totalSalesGrowthRate: 0,
    orderCount: 0,
    orderCountGrowthRate: 0,
    totalProducts: 0,
    totalProductsGrowthRate: 0,
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
          totalSalesGrowthRate: salesRes.data.growthRate,
          orderCount: orderRes.data.orderCount,
          orderCountGrowthRate: orderRes.data.growthRate,
          totalProducts: productRes.data.totalProducts,
          totalProductsGrowthRate: productRes.data.growthRate,
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
          <AdminCard
            icon={<span>💰</span>}
            title="1월 총 매출"
            value={data.totalSales.toLocaleString()}
            unit="원"
            comparisonLabel="이전 달 대비"
            comparisonValue={
              data.totalSalesGrowthRate > 0
                ? `+${data.totalSalesGrowthRate}%`
                : `${data.totalSalesGrowthRate}%`
            }
            comparisonPositive={data.totalSalesGrowthRate > 0}
            dropdownOptions={["연 기준", "월 기준"]}
            dropdownValue={"연 기준"}
            onDropdownChange={() => {}}
          />
          <AdminCard
            icon={<span>👥</span>}
            title="1월 주문 수"
            value={data.orderCount}
            unit="건"
            comparisonLabel="전월 대비"
            comparisonValue={
              data.orderCountGrowthRate > 0
                ? `+${data.orderCountGrowthRate}%`
                : `${data.orderCountGrowthRate}%`
            }
            comparisonPositive={data.orderCountGrowthRate > 0}
            dropdownOptions={["일 기준", "주 기준"]}
            dropdownValue={"일 기준"}
            onDropdownChange={() => {}}
          />
          <AdminCard
            icon={<span>📦</span>}
            title="2025년 제품 수"
            value={data.totalProducts}
            unit="건"
            comparisonLabel="작년 대비"
            comparisonValue={
              data.totalProductsGrowthRate > 0
                ? `+${data.totalProductsGrowthRate}%`
                : `${data.totalProductsGrowthRate}%`
            }
            comparisonPositive={data.totalProductsGrowthRate > 0}
            dropdownOptions={["연 기준"]}
            dropdownValue={"연 기준"}
            onDropdownChange={() => {}}
          />
          <AdminCard
            icon={<span>🚚</span>}
            title="배송 완료"
            value={data.inTransitOrders}
            unit="건"
            dropdownOptions={["주 기준"]}
            dropdownValue={"주 기준"}
            onDropdownChange={() => {}}
          />
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
