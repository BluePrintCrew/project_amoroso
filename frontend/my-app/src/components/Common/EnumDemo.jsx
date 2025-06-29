import React, { useState } from 'react';
import PaymentStatusBadge from './PaymentStatusBadge';
import DeliveryStatusBadge from './DeliveryStatusBadge';
import ElevatorFloorSelect from './ElevatorFloorSelect';
import { 
  PAYMENT_STATUS, 
  DELIVERY_STATUS, 
  ELEVATOR_FLOOR,
  PAYMENT_STATUS_OPTIONS,
  DELIVERY_STATUS_OPTIONS
} from '../../constants/enums';
import styles from './EnumDemo.module.css';

const EnumDemo = () => {
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(PAYMENT_STATUS.PENDING);
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(DELIVERY_STATUS.PENDING);

  return (
    <div className={styles.demoContainer}>
      <h2 className={styles.title}>Enum 컴포넌트 데모</h2>
      
      {/* 엘레베이터 층수 선택 */}
      <section className={styles.section}>
        <h3>엘레베이터 층수 선택</h3>
        <ElevatorFloorSelect
          value={selectedFloor}
          onChange={setSelectedFloor}
          placeholder="배송 층수를 선택하세요"
        />
        <p className={styles.result}>
          선택된 층수: <strong>{selectedFloor || '선택되지 않음'}</strong>
        </p>
      </section>

      {/* 결제 상태 표시 */}
      <section className={styles.section}>
        <h3>결제 상태 표시</h3>
        <div className={styles.statusGrid}>
          {PAYMENT_STATUS_OPTIONS.map((option) => (
            <div key={option.value} className={styles.statusItem}>
              <PaymentStatusBadge 
                status={option.value} 
                size="medium"
              />
              <span className={styles.statusCode}>{option.value}</span>
            </div>
          ))}
        </div>
        
        <div className={styles.interactiveSection}>
          <h4>상호작용 테스트</h4>
          <select 
            value={selectedPaymentStatus} 
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className={styles.select}
          >
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className={styles.selectedStatus}>
            선택된 상태: <PaymentStatusBadge status={selectedPaymentStatus} size="large" />
          </div>
        </div>
      </section>

      {/* 배송 상태 표시 */}
      <section className={styles.section}>
        <h3>배송 상태 표시</h3>
        <div className={styles.statusGrid}>
          {DELIVERY_STATUS_OPTIONS.map((option) => (
            <div key={option.value} className={styles.statusItem}>
              <DeliveryStatusBadge 
                status={option.value} 
                size="medium"
              />
              <span className={styles.statusCode}>{option.value}</span>
            </div>
          ))}
        </div>
        
        <div className={styles.interactiveSection}>
          <h4>상호작용 테스트</h4>
          <select 
            value={selectedDeliveryStatus} 
            onChange={(e) => setSelectedDeliveryStatus(e.target.value)}
            className={styles.select}
          >
            {DELIVERY_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className={styles.selectedStatus}>
            선택된 상태: <DeliveryStatusBadge status={selectedDeliveryStatus} size="large" />
          </div>
        </div>
      </section>

      {/* 사용법 안내 */}
      <section className={styles.section}>
        <h3>사용법</h3>
        <div className={styles.usage}>
          <h4>1. 결제 상태 표시</h4>
          <pre className={styles.code}>
{`import PaymentStatusBadge from './components/Common/PaymentStatusBadge';

<PaymentStatusBadge status="COMPLETED" size="medium" />`}
          </pre>

          <h4>2. 배송 상태 표시</h4>
          <pre className={styles.code}>
{`import DeliveryStatusBadge from './components/Common/DeliveryStatusBadge';

<DeliveryStatusBadge status="SHIPPED" size="large" showIcon={true} />`}
          </pre>

          <h4>3. 엘레베이터 층수 선택</h4>
          <pre className={styles.code}>
{`import ElevatorFloorSelect from './components/Common/ElevatorFloorSelect';

<ElevatorFloorSelect
  value={floor}
  onChange={setFloor}
  placeholder="층수를 선택하세요"
/>`}
          </pre>

          <h4>4. Enum 상수 직접 사용</h4>
          <pre className={styles.code}>
{`import { PAYMENT_STATUS, DELIVERY_STATUS } from './constants/enums';

const status = PAYMENT_STATUS.COMPLETED;
const delivery = DELIVERY_STATUS.SHIPPED;`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default EnumDemo; 