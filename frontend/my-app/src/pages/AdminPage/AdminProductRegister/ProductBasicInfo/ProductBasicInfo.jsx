import React from "react";
import styles from "./ProductBasicInfo.module.css";

function ProductBasicInfo({
  productCode,
  setProductCode,
  modelName,
  setModelName,
  price,
  setPrice
  // ... 필요한 다른 props (브랜드, 원가, 할인율 등)
}) {
  return (
    <section className={styles.basicInfoSection}>
      <h3 className={styles.sectionTitle}>기본 정보</h3>

      {/* 2컬럼 그리드 레이아웃 */}
      <div className={styles.formGrid}>
        {/* Row 1: 상품코드 */}
        <div className={styles.formLabel}>상품코드</div>
        <div className={styles.formInput}>
          <input
            type="text"
            placeholder="예) 17324T4190"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
        </div>

        {/* Row 2: 모델명 */}
        <div className={styles.formLabel}>모델명</div>
        <div className={styles.formInput}>
          <input
            type="text"
            placeholder="예) 2023신상 모델명"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          />
        </div>

        {/* Row 3: 가격 */}
        <div className={styles.formLabel}>가격</div>
        <div className={styles.formInput}>
          <input
            type="number"
            placeholder="숫자만 입력"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* 필요하다면 브랜드, 할인율, 원가 등 추가 */}
      </div>
    </section>
  );
}

export default ProductBasicInfo;
