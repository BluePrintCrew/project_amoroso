# Enum 상수 및 컴포넌트 가이드

이 폴더에는 프론트엔드에서 사용하는 enum 상수들과 관련 컴포넌트들이 정의되어 있습니다.

## 📁 파일 구조

```
constants/
├── enums.js              # 모든 enum 상수 정의
├── categories.js         # 카테고리 관련 상수
└── README.md            # 이 파일

components/Common/
├── StatusBadge.jsx       # 기본 상태 표시 컴포넌트
├── StatusBadge.module.css
├── PaymentStatusBadge.jsx # 결제 상태 전용 컴포넌트
├── DeliveryStatusBadge.jsx # 배송 상태 전용 컴포넌트
├── ElevatorFloorSelect.jsx # 엘레베이터 층수 선택 컴포넌트
├── ElevatorFloorSelect.module.css
├── EnumDemo.jsx          # 사용 예시 데모 컴포넌트
└── EnumDemo.module.css
```

## 🎯 정의된 Enum 상수들

### 1. 엘레베이터 층수 (ELEVATOR_FLOOR)
- `GROUND` ~ `TWENTIETH`: 지하 ~ 20층
- `ABOVE_20TH`: 20층 이상
- `NO_ELEVATOR`: 엘레베이터 없음

### 2. 결제 상태 (PAYMENT_STATUS)
- `PENDING`: 결제 대기
- `COMPLETED`: 결제 완료
- `FAILED`: 결제 실패
- `CANCELLED`: 결제 취소
- `REFUNDED`: 환불 완료
- `PARTIAL_REFUNDED`: 부분 환불

### 3. 배송 상태 (DELIVERY_STATUS)
- `PENDING`: 배송 대기
- `PREPARING`: 배송 준비 중
- `SHIPPED`: 배송 중
- `DELIVERED`: 배송 완료
- `FAILED`: 배송 실패
- `RETURNED`: 반송
- `CANCELLED`: 배송 취소

## 🚀 사용법

### 1. 결제 상태 표시

```jsx
import PaymentStatusBadge from './components/Common/PaymentStatusBadge';

// 기본 사용
<PaymentStatusBadge status="COMPLETED" />

// 크기 조절
<PaymentStatusBadge status="PENDING" size="large" />

// 아이콘 숨기기
<PaymentStatusBadge status="FAILED" showIcon={false} />
```

### 2. 배송 상태 표시

```jsx
import DeliveryStatusBadge from './components/Common/DeliveryStatusBadge';

// 기본 사용 (아이콘 포함)
<DeliveryStatusBadge status="SHIPPED" />

// 크기 조절
<DeliveryStatusBadge status="DELIVERED" size="small" />

// 아이콘 숨기기
<DeliveryStatusBadge status="PREPARING" showIcon={false} />
```

### 3. 엘레베이터 층수 선택

```jsx
import ElevatorFloorSelect from './components/Common/ElevatorFloorSelect';

const [floor, setFloor] = useState('');

<ElevatorFloorSelect
  value={floor}
  onChange={setFloor}
  placeholder="배송 층수를 선택하세요"
  required={true}
/>
```

### 4. Enum 상수 직접 사용

```jsx
import { 
  PAYMENT_STATUS, 
  DELIVERY_STATUS, 
  ELEVATOR_FLOOR,
  PAYMENT_STATUS_LABELS,
  DELIVERY_STATUS_COLORS
} from './constants/enums';

// 상수 사용
const status = PAYMENT_STATUS.COMPLETED;
const delivery = DELIVERY_STATUS.SHIPPED;
const floor = ELEVATOR_FLOOR.FIFTH;

// 라벨 가져오기
const statusLabel = PAYMENT_STATUS_LABELS[status]; // "결제 완료"

// 색상 가져오기
const statusColor = DELIVERY_STATUS_COLORS[delivery]; // "#9C27B0"
```

### 5. 옵션 배열 사용 (Select 컴포넌트용)

```jsx
import { PAYMENT_STATUS_OPTIONS } from './constants/enums';

<select onChange={(e) => setStatus(e.target.value)}>
  {PAYMENT_STATUS_OPTIONS.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
```

## 🎨 컴포넌트 Props

### StatusBadge (기본)
- `status`: 표시할 상태 값
- `labelMap`: 상태별 라벨 매핑 객체
- `colorMap`: 상태별 색상 매핑 객체
- `iconMap`: 상태별 아이콘 매핑 객체 (선택)
- `size`: 크기 ('small', 'medium', 'large')
- `showIcon`: 아이콘 표시 여부 (기본: true)
- `className`: 추가 CSS 클래스

### PaymentStatusBadge
- `status`: 결제 상태 값
- `size`: 크기 ('small', 'medium', 'large')
- `showIcon`: 아이콘 표시 여부 (기본: false)
- `className`: 추가 CSS 클래스

### DeliveryStatusBadge
- `status`: 배송 상태 값
- `size`: 크기 ('small', 'medium', 'large')
- `showIcon`: 아이콘 표시 여부 (기본: true)
- `className`: 추가 CSS 클래스

### ElevatorFloorSelect
- `value`: 선택된 값
- `onChange`: 값 변경 핸들러
- `placeholder`: 플레이스홀더 텍스트
- `disabled`: 비활성화 여부
- `required`: 필수 여부
- `className`: 추가 CSS 클래스

## 🎯 유틸리티 함수

```jsx
import { 
  getEnumLabel, 
  getEnumColor, 
  getEnumIcon 
} from './constants/enums';

// 라벨 가져오기
const label = getEnumLabel('COMPLETED', PAYMENT_STATUS_LABELS);

// 색상 가져오기
const color = getEnumColor('SHIPPED', DELIVERY_STATUS_COLORS);

// 아이콘 가져오기
const icon = getEnumIcon('DELIVERED', DELIVERY_STATUS_ICONS);
```

## 🧪 데모 확인

EnumDemo 컴포넌트를 통해 모든 기능을 확인할 수 있습니다:

```jsx
import EnumDemo from './components/Common/EnumDemo';

// App.js나 원하는 페이지에서 사용
<EnumDemo />
```

## 🔧 확장 방법

새로운 enum을 추가하려면:

1. `enums.js`에 상수 정의
2. 라벨, 색상, 아이콘 매핑 추가
3. 옵션 배열 생성
4. 필요시 전용 컴포넌트 생성

## 📝 주의사항

- 모든 enum 값은 백엔드와 일치해야 합니다
- 새로운 상태가 추가되면 관련 매핑도 함께 업데이트하세요
- 색상은 접근성을 고려하여 충분한 대비를 가지도록 설정되어 있습니다 