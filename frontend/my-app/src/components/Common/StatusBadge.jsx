import React from 'react';
import styles from './StatusBadge.module.css';

const StatusBadge = ({ 
  status, 
  labelMap, 
  colorMap, 
  iconMap, 
  size = 'medium',
  showIcon = true,
  className = ''
}) => {
  const label = labelMap[status] || status;
  const color = colorMap[status] || '#000000';
  const icon = iconMap ? iconMap[status] : '';

  return (
    <span 
      className={`${styles.statusBadge} ${styles[size]} ${className}`}
      style={{ 
        backgroundColor: color,
        color: getContrastColor(color)
      }}
    >
      {showIcon && icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
    </span>
  );
};

// 배경색에 따른 텍스트 색상 결정 함수
const getContrastColor = (hexColor) => {
  // hex를 rgb로 변환
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // 밝기 계산
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // 밝기에 따라 흰색 또는 검은색 반환
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

export default StatusBadge; 