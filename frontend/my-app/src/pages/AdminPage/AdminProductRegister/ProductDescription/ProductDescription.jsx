import React from "react";
import styles from "./ProductDescription.module.css";

function ProductDescription({ description, setDescription }) {
  return (
    <section className={styles.descriptionSection}>
      <h3 className={styles.sectionTitle}>상세 설명</h3>
      <div className={styles.formRow}>
        <label>상품 상세</label>
        <textarea
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="상품 상세 내용을 입력하세요"
        />
      </div>
    </section>
  );
}

export default ProductDescription;
