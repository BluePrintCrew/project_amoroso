import React from "react";
import styles from "./OrderForm.module.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const OrderTable = ({ products }) => {
  return (
    <div className={styles.infoTable}>
      <div className={styles.infoHeader1}>
        <div className={`${styles.column} ${styles.leftAlign}`}>상품정보</div>
        <div className={`${styles.column} ${styles.centerAlign}`}>수량</div>
        <div className={`${styles.column} ${styles.centerAlign}`}>상품금액</div>
        <div className={`${styles.column} ${styles.centerAlign}`}>배송정보</div>
      </div>

      <div className={styles.infoHeader2}>
        <div className={`${styles.column} ${styles.leftAlign}`}>
          <span className={styles.mainText}>로젠택배</span>
          <span className={styles.subText}>배송/설치일 직접 지정 가능</span>
        </div>
      </div>

      {products.map((product, index) => (
        <div key={index} className={styles.infoBody}>
          <div className={styles.row}>
            <div className={`${styles.column} ${styles.leftAlign}`}>
              <div className={styles.productInfo}>
                <img
                  src={
                    product.mainImageURL
                      ? `${API_BASE_URL}/api/v1/images/${product.mainImageURL
                          .split("/")
                          .pop()}`
                      : "https://placehold.co/120x120"
                  }
                  alt="상품 이미지"
                  className={styles.productImage}
                />
                <div>
                  <p>{product.brandName}</p>
                  <p className={styles.productName}>{product.productName}</p>
                  {product.additionalOptionName && (
                    <p className={styles.productOption}>
                      {product.additionalOptionName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className={`${styles.column} ${styles.centerAlign}`}>
              <p>{product.quantity || 1}</p>
            </div>

            <div className={`${styles.column} ${styles.centerAlign}`}>
              <p className={styles.price}>
                {product.discountPrice?.toLocaleString()}원
              </p>
              <p className={styles.originalPrice}>
                {product.marketPrice?.toLocaleString()}원
              </p>
              {/* <button className={styles.discountInfo}>할인내역</button> */}
            </div>

            <div className={`${styles.column} ${styles.centerAlign}`}>
              <p className={styles.shipping1}>무료배송</p>
              <p className={styles.shipping2}>지역별/옵션별 배송비 추가</p>
              <p className={styles.shipping3}>지역별 배송비</p>
            </div>
          </div>
        </div>
      ))}

      <div className={styles.infoBottom}>
        <p>
          • 배송일자 안내 내용입니다. 배송일자 안내 내용입니다. 배송일자 안내
          내용입니다.
        </p>
      </div>
    </div>
  );
};

export default OrderTable;
