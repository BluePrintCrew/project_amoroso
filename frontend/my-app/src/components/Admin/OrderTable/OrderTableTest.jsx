import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './OrderTable.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const OrderTableTest = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

        axios.get(`${API_BASE_URL}/api/v1/sellers/order-summary?page=0&size=5`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(res => setOrders(res.data.content))
            .catch(err => console.error('OrderTableTest fetch error:', err));
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case '접수대기': return styles.statusPending;
            case '접수완료': return styles.statusConfirmed;
            case '배송중': return styles.statusShipping;
            case '배송완료': return styles.statusDelivered;
            case '주문취소': return styles.statusCanceled;
            default: return '';
        }
    };

    const getPaymentClass = (status) => {
        return status === '결제완료' ? styles.paymentComplete : styles.paymentFailed;
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>주문 현황</h2>

            <table className={styles.orderTable}>
                <thead>
                <tr>
                    <th>주문 코드</th>
                    <th>주문 일시</th>
                    <th>고객 성함</th>
                    <th>고객 주소</th>
                    <th>주문 상태</th>
                    <th>결제 상태</th>
                    <th>총 결제 금액</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.orderId}>
                        <td>{order.orderCode}</td>
                        <td>{new Date(order.orderDate).toLocaleString()}</td>
                        <td>{order.customerName}</td>
                        <td>{order.fullAddress}</td>
                        <td>
                <span className={`${styles.statusTag} ${getStatusClass(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                        </td>
                        <td>
                <span className={`${styles.paymentStatus} ${getPaymentClass(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
                        </td>
                        <td>{order.totalPrice.toLocaleString()} 원</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTableTest;
