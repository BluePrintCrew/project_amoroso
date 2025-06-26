import React from "react";
import styles from "./CartSummary.module.css";

function CartSummary({ cartItems = [] }) {
  // 주어진 로직 - 총 상품금액, 총 결제금액, 할인액 계산
  const totalOriginalPrice = cartItems.reduce(
      (sum, item) => sum + (item.originalPrice || 0) * (item.quantity || 1),
      0
  );
  const totalPrice = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
  );
  const totalDiscount = totalOriginalPrice - totalPrice;

  // 배송비 계산 로직 수정
  const shippingPrice = cartItems.reduce(
      (sum, item) => sum + (item.shippingFee || 0),
      0
  );

  const POINT_RATE = 0.01;
  const point = Math.floor(totalPrice * POINT_RATE); // 예시로 고정

  return (
      <div className={styles.orderSummary}>
        {/* 상단 헤더 */}
        <div className={styles.summaryHeader}>
          <div>총 상품금액</div>
          <div>총 할인금액</div>
          <div>총 배송비</div>
          <div>총 결제예정금액</div>
        </div>

        {/* 중간 금액 (상품 - 할인 + 배송 = 결제) */}
        <div className={styles.summaryBody}>
        <span className={styles.price}>
          {totalOriginalPrice.toLocaleString()}원
        </span>
          <span className={styles.operator}>-</span>
          <span className={styles.discount}>
          {totalDiscount.toLocaleString()}원
        </span>
          <span className={styles.operator}>+</span>
          <span className={styles.price}>{shippingPrice.toLocaleString()}원</span>
          <span className={styles.operator}>=</span>
          <span className={styles.total}>{(totalPrice + shippingPrice).toLocaleString()}원</span>
        </div>

        {/* 하단 상세 영역 */}
        <div className={styles.summaryDetail}>
          <div className={styles.detailRow}>
            {/* (1) 상품금액 */}
            <div className={styles.item}>
              <span className={styles.label}>상품금액</span>
              <span className={styles.value}>
              {totalOriginalPrice.toLocaleString()}원
            </span>
            </div>

            {/* (2) 쿠폰할인 + 쿠폰적용 버튼 */}
            <div className={styles.item}>
              <div className={styles.couponBox}>
                <span className={styles.label}>쿠폰할인</span>
                <button className={styles.couponBtn}>쿠폰적용</button>
              </div>
              <span className={`${styles.value} ${styles.discount}`}>
              {totalDiscount.toLocaleString()}원
            </span>
            </div>

            {/* (3) 배송비 */}
            <div className={styles.item}>
              <span className={styles.label}>배송비</span>
              <span className={styles.value}>
              {shippingPrice.toLocaleString()}원
            </span>
            </div>

            {/* (4) 적립 예정 포인트 */}
            <div className={styles.item}>
              <span className={styles.label}>적립 예정 포인트</span>
              <span className={styles.value}>{point.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className={styles.summaryNotice}>
          <p>• 배송비가 안내 내용입니다. 배송비가 안내 내용입니다.</p>
          <p>
            • 배송비가 안내 내용입니다. 배송비가 안내 내용입니다. 배송비가 안내
            내용입니다.
          </p>
        </div>
      </div>
  );
}

export default CartSummary;