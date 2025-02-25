import React, { useState } from "react";
import styles from "./AdminProductRegister.module.css";

function AdminProductRegister() {
  const [productCode, setProductCode] = useState("");
  const [brand, setBrand] = useState("");
  const [modelName, setModelName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");

  const handleTempSave = () => {
    alert("임시 저장되었습니다!");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const productData = {
      productCode,
      brand,
      modelName,
      price,
      cost,
      discount,
      category,
    };
    console.log("등록할 데이터:", productData);
    alert("등록 완료!");
  };

  return (
    <div className={styles.adminProductRegister}>
      <div className={styles.topBar}>
        <h2>관리자 페이지</h2>
        <div className={styles.topBarButtons}>
          <button type="button" onClick={handleTempSave}>
            임시저장
          </button>
          <button form="productForm" type="submit" className={styles.mainButton}>
            등록하기
          </button>
        </div>
      </div>

      <form id="productForm" onSubmit={handleRegister} className={styles.registerForm}>
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>상품 입력</h2>
          <div className={styles.formGrid}>
            <div className={styles.formLabel}>상품코드</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 17324T4190"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>브랜드</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) AMOROSO"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>모델명</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 2023신상 모델명"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>가격</div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="숫자만 입력"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>원가</div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="예) 50000"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>할인율</div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="예) 10 (10% 할인)"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>카테고리</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 패션/남성의류/티셔츠"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

export default AdminProductRegister;
