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
import React, { useState } from 'react';

import styles from './AdminChart.module.css';

const data = [
  { month: '1월', sales: 889217520 },
  { month: '2월', sales: 750000000 },
  { month: '3월', sales: 720000000 },
  { month: '4월', sales: 430000000 },
  { month: '5월', sales: 990000000 },
  { month: '6월', sales: 680000000 },
  { month: '7월', sales: 770000000 },
  { month: '8월', sales: 810000000 },
  { month: '9월', sales: 670000000 },
  { month: '10월', sales: 970000000 },
  { month: '11월', sales: 760000000 },
  { month: '12월', sales: 980000000 },
];

const AdminChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);

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
                fill={
                  hoveredIndex === index ? '#008000' : 'rgba(0, 128, 0, 0.2)'
                }
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setHoveredData(entry);
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setHoveredData(null);
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminChart;
