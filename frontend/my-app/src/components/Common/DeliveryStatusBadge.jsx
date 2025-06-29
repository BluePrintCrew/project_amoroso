import React from 'react';
import StatusBadge from './StatusBadge';
import { 
  DELIVERY_STATUS_LABELS, 
  DELIVERY_STATUS_COLORS,
  DELIVERY_STATUS_ICONS
} from '../../constants/enums';

const DeliveryStatusBadge = ({ 
  status, 
  size = 'medium',
  showIcon = true,
  className = ''
}) => {
  return (
    <StatusBadge
      status={status}
      labelMap={DELIVERY_STATUS_LABELS}
      colorMap={DELIVERY_STATUS_COLORS}
      iconMap={DELIVERY_STATUS_ICONS}
      size={size}
      showIcon={showIcon}
      className={className}
    />
  );
};

export default DeliveryStatusBadge; 