import React from "react";
import styles from "./ProductImages.module.css";

function ProductImages({
  mainImage,
  setMainImage,
  subImages,
  setSubImages,
}) {
  const handleMainImageChange = (e) => {
    // e.target.files[0]
    setMainImage(e.target.files[0]);
  };

  const handleSubImagesChange = (e) => {
    setSubImages([...e.target.files]); 
    // or handle multiple logic
  };

  return (
    <section className={styles.imagesSection}>
      <h3 className={styles.sectionTitle}>이미지 등록</h3>

      <div className={styles.formRow}>
        <label>메인 이미지</label>
        <input type="file" onChange={handleMainImageChange} />
      </div>

      <div className={styles.formRow}>
        <label>추가 이미지</label>
        <input type="file" multiple onChange={handleSubImagesChange} />
      </div>

      {/* Possibly preview the images */}
    </section>
  );
}

export default ProductImages;
