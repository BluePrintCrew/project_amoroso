import React from 'react';
import { ELEVATOR_FLOOR_OPTIONS } from '../../constants/enums';
import styles from './ElevatorFloorSelect.module.css';

const ElevatorFloorSelect = ({ 
  value, 
  onChange, 
  placeholder = '층수를 선택하세요',
  disabled = false,
  className = '',
  required = false
}) => {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`${styles.select} ${className}`}
      required={required}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {ELEVATOR_FLOOR_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default ElevatorFloorSelect; 