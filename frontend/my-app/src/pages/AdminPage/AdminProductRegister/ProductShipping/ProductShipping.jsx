import React from "react";
import styles from "./ProductShipping.module.css";

function ProductShipping({
  shippingFee,
  setShippingFee,
  stock,
  setStock,
  // ... etc.
}) {
  return (
    <section className={styles.shippingSection}>
      <h3 className={styles.sectionTitle}>배송 및 기타 정보</h3>

      <div className={styles.formRow}>
        <label>배송비</label>
        <input
          type="number"
          value={shippingFee}
          onChange={(e) => setShippingFee(e.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <label>재고수량</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>
    </section>
  );
}

export default ProductShipping;
