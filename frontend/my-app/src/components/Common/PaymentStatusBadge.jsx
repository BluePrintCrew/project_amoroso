import React from 'react';
import StatusBadge from './StatusBadge';
import { 
  PAYMENT_STATUS_LABELS, 
  PAYMENT_STATUS_COLORS 
} from '../../constants/enums';

const PaymentStatusBadge = ({ 
  status, 
  size = 'medium',
  showIcon = false,
  className = ''
}) => {
  return (
    <StatusBadge
      status={status}
      labelMap={PAYMENT_STATUS_LABELS}
      colorMap={PAYMENT_STATUS_COLORS}
      size={size}
      showIcon={showIcon}
      className={className}
    />
  );
};

export default PaymentStatusBadge; 