import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import axios from 'axios';
import styles from './AdminChart.module.css';
import { API_BASE_URL } from "../../../pages/MyPage/api";

const AdminChartTest = () => {
    const [data, setData] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        const year = new Date().getFullYear();
        const accessToken = localStorage.getItem('access_token');

        axios.get(`${API_BASE_URL}/api/v1/sellers/monthly-sales?year=${year}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(res => {
                const response = res.data.monthlySales;
                const formatted = response.map((sales, index) => ({
                    month: `${index + 1}월`,
                    sales: sales
                }));
                setData(formatted);
            })
            .catch(err => console.error('AdminChartTest fetch error:', err));
    }, []);

    return (
        <div className={styles.chartContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>매출 통계</h2>
                <select className={styles.dropdown}>
                    <option>연 기준</option>
                </select>
            </div>
            <p className={styles.subTitle}>연별 통계</p>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#555', fontSize: 14 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className={styles.tooltip}>
                                        <p>{`${payload[0].payload.month} 총 매출`}</p>
                                        <strong>{`${payload[0].value.toLocaleString()} 원`}</strong>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="sales" radius={[10, 10, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={hoveredIndex === index ? '#008000' : 'rgba(0, 128, 0, 0.2)'}
                                onMouseEnter={() => {
                                    setHoveredIndex(index);
                                }}
                                onMouseLeave={() => {
                                    setHoveredIndex(null);
                                }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AdminChartTest;
