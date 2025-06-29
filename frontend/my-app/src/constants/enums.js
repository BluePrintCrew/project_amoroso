// 엘레베이터 층수 enum
export const ELEVATOR_FLOOR = {
  GROUND: 'GROUND',
  FIRST: 'FIRST',
  SECOND: 'SECOND',
  THIRD: 'THIRD',
  FOURTH: 'FOURTH',
  FIFTH: 'FIFTH',
  SIXTH: 'SIXTH',
  SEVENTH: 'SEVENTH',
  EIGHTH: 'EIGHTH',
  NINTH: 'NINTH',
  TENTH: 'TENTH',
  ELEVENTH: 'ELEVENTH',
  TWELFTH: 'TWELFTH',
  THIRTEENTH: 'THIRTEENTH',
  FOURTEENTH: 'FOURTEENTH',
  FIFTEENTH: 'FIFTEENTH',
  SIXTEENTH: 'SIXTEENTH',
  SEVENTEENTH: 'SEVENTEENTH',
  EIGHTEENTH: 'EIGHTEENTH',
  NINETEENTH: 'NINETEENTH',
  TWENTIETH: 'TWENTIETH',
  ABOVE_20TH: 'ABOVE_20TH',
  NO_ELEVATOR: 'NO_ELEVATOR'
};

// 엘레베이터 층수 라벨 매핑
export const ELEVATOR_FLOOR_LABELS = {
  [ELEVATOR_FLOOR.GROUND]: '지하',
  [ELEVATOR_FLOOR.FIRST]: '1층',
  [ELEVATOR_FLOOR.SECOND]: '2층',
  [ELEVATOR_FLOOR.THIRD]: '3층',
  [ELEVATOR_FLOOR.FOURTH]: '4층',
  [ELEVATOR_FLOOR.FIFTH]: '5층',
  [ELEVATOR_FLOOR.SIXTH]: '6층',
  [ELEVATOR_FLOOR.SEVENTH]: '7층',
  [ELEVATOR_FLOOR.EIGHTH]: '8층',
  [ELEVATOR_FLOOR.NINTH]: '9층',
  [ELEVATOR_FLOOR.TENTH]: '10층',
  [ELEVATOR_FLOOR.ELEVENTH]: '11층',
  [ELEVATOR_FLOOR.TWELFTH]: '12층',
  [ELEVATOR_FLOOR.THIRTEENTH]: '13층',
  [ELEVATOR_FLOOR.FOURTEENTH]: '14층',
  [ELEVATOR_FLOOR.FIFTEENTH]: '15층',
  [ELEVATOR_FLOOR.SIXTEENTH]: '16층',
  [ELEVATOR_FLOOR.SEVENTEENTH]: '17층',
  [ELEVATOR_FLOOR.EIGHTEENTH]: '18층',
  [ELEVATOR_FLOOR.NINETEENTH]: '19층',
  [ELEVATOR_FLOOR.TWENTIETH]: '20층',
  [ELEVATOR_FLOOR.ABOVE_20TH]: '20층 이상',
  [ELEVATOR_FLOOR.NO_ELEVATOR]: '엘레베이터 없음'
};

// 엘리베이터 구간 enum (구매내역/모달용)
export const ELEVATOR_RANGE = {
  ONE_TO_SEVEN: 'ONE_TO_SEVEN',
  EIGHT_TO_TEN: 'EIGHT_TO_TEN',
  ABOVE_ELEVEN: 'ABOVE_ELEVEN',
  NO_ELEVATOR: 'NO_ELEVATOR'
};

export const ELEVATOR_RANGE_LABELS = {
  [ELEVATOR_RANGE.ONE_TO_SEVEN]: '1~7층',
  [ELEVATOR_RANGE.EIGHT_TO_TEN]: '8~10층',
  [ELEVATOR_RANGE.ABOVE_ELEVEN]: '11층 이상',
  [ELEVATOR_RANGE.NO_ELEVATOR]: '엘리베이터 없음'
};

export const ELEVATOR_RANGE_OPTIONS = Object.entries(ELEVATOR_RANGE_LABELS).map(([value, label]) => ({
  value,
  label
}));

// 결제 상태 enum
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',           // 결제 대기
  COMPLETED: 'COMPLETED',       // 결제 완료
  FAILED: 'FAILED',            // 결제 실패
  CANCELLED: 'CANCELLED',      // 결제 취소
  REFUNDED: 'REFUNDED',        // 환불 완료
  PARTIAL_REFUNDED: 'PARTIAL_REFUNDED'  // 부분 환불
};

// 결제 상태 라벨 매핑
export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: '결제 대기',
  [PAYMENT_STATUS.COMPLETED]: '결제 완료',
  [PAYMENT_STATUS.FAILED]: '결제 실패',
  [PAYMENT_STATUS.CANCELLED]: '결제 취소',
  [PAYMENT_STATUS.REFUNDED]: '환불 완료',
  [PAYMENT_STATUS.PARTIAL_REFUNDED]: '부분 환불'
};

// 결제 상태 색상 매핑
export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]: '#FFA500',      // 주황색
  [PAYMENT_STATUS.COMPLETED]: '#4CAF50',    // 초록색
  [PAYMENT_STATUS.FAILED]: '#F44336',       // 빨간색
  [PAYMENT_STATUS.CANCELLED]: '#9E9E9E',    // 회색
  [PAYMENT_STATUS.REFUNDED]: '#2196F3',     // 파란색
  [PAYMENT_STATUS.PARTIAL_REFUNDED]: '#FF9800'  // 주황색
};

// 배송 상태 enum
export const DELIVERY_STATUS = {
  PENDING: 'PENDING',           // 배송 대기
  PREPARING: 'PREPARING',       // 배송 준비 중
  SHIPPED: 'SHIPPED',          // 배송 중
  DELIVERED: 'DELIVERED',      // 배송 완료
  FAILED: 'FAILED',            // 배송 실패
  RETURNED: 'RETURNED',        // 반송
  CANCELLED: 'CANCELLED'       // 배송 취소
};

// 배송 상태 라벨 매핑
export const DELIVERY_STATUS_LABELS = {
  [DELIVERY_STATUS.PENDING]: '배송 대기',
  [DELIVERY_STATUS.PREPARING]: '배송 준비 중',
  [DELIVERY_STATUS.SHIPPED]: '배송 중',
  [DELIVERY_STATUS.DELIVERED]: '배송 완료',
  [DELIVERY_STATUS.FAILED]: '배송 실패',
  [DELIVERY_STATUS.RETURNED]: '반송',
  [DELIVERY_STATUS.CANCELLED]: '배송 취소'
};

// 배송 상태 색상 매핑
export const DELIVERY_STATUS_COLORS = {
  [DELIVERY_STATUS.PENDING]: '#FFA500',     // 주황색
  [DELIVERY_STATUS.PREPARING]: '#2196F3',   // 파란색
  [DELIVERY_STATUS.SHIPPED]: '#9C27B0',     // 보라색
  [DELIVERY_STATUS.DELIVERED]: '#4CAF50',   // 초록색
  [DELIVERY_STATUS.FAILED]: '#F44336',      // 빨간색
  [DELIVERY_STATUS.RETURNED]: '#FF9800',    // 주황색
  [DELIVERY_STATUS.CANCELLED]: '#9E9E9E'    // 회색
};

// 배송 상태 아이콘 매핑
export const DELIVERY_STATUS_ICONS = {
  [DELIVERY_STATUS.PENDING]: '⏳',
  [DELIVERY_STATUS.PREPARING]: '📦',
  [DELIVERY_STATUS.SHIPPED]: '🚚',
  [DELIVERY_STATUS.DELIVERED]: '✅',
  [DELIVERY_STATUS.FAILED]: '❌',
  [DELIVERY_STATUS.RETURNED]: '↩️',
  [DELIVERY_STATUS.CANCELLED]: '🚫'
};

// 유틸리티 함수들
export const getEnumLabel = (enumValue, labelMap) => {
  return labelMap[enumValue] || enumValue;
};

export const getEnumColor = (enumValue, colorMap) => {
  return colorMap[enumValue] || '#000000';
};

export const getEnumIcon = (enumValue, iconMap) => {
  return iconMap[enumValue] || '';
};

// 엘레베이터 층수 옵션 배열 (select 컴포넌트용)
export const ELEVATOR_FLOOR_OPTIONS = Object.entries(ELEVATOR_FLOOR_LABELS).map(([value, label]) => ({
  value,
  label
}));

// 결제 상태 옵션 배열
export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
  color: PAYMENT_STATUS_COLORS[value]
}));

// 배송 상태 옵션 배열
export const DELIVERY_STATUS_OPTIONS = Object.entries(DELIVERY_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
  color: DELIVERY_STATUS_COLORS[value],
  icon: DELIVERY_STATUS_ICONS[value]
})); 