import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminCard.css';
import { API_BASE_URL } from "../../../pages/MyPage/api";

const accessToken = localStorage.getItem('access_token');

function AdminCard({ title, children, style }) {
    return (
        <div className="admin-card" style={style}>
            <div className="card-content">
                {children}
            </div>
            {title && <h3 className="card-title">{title}</h3>}
        </div>
    );
}

const AdminCardTest = () => {
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
                    axios.get(`${API_BASE_URL}/api/v1/sellers/total-sales?year=${year}&month=${month}`, headers),
                    axios.get(`${API_BASE_URL}/api/v1/sellers/total-orders?year=${year}&month=${month}`, headers),
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
                console.error('AdminCardTest fetch error:', err);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <AdminCard title="총 매출">{data.totalSales.toLocaleString()} 원</AdminCard>
            <AdminCard title="주문 수">{data.orderCount} 건</AdminCard>
            <AdminCard title="상품 수">{data.totalProducts} 개</AdminCard>
            <AdminCard title="배송 중">{data.inTransitOrders} 건</AdminCard>
        </>
    );
};

export default AdminCardTest;
