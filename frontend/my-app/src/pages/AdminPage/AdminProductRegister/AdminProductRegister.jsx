import React, { useState } from "react";
import styles from "./AdminProductRegister.module.css";

function AdminProductRegister() {
  // (1) 카테고리 설정
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");

  // (2) 기본 정보
  const [productCode, setProductCode] = useState("");
  const [brand, setBrand] = useState("");
  const [modelName, setModelName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [discount, setDiscount] = useState("");

  // 새로 추가된 필드
  const [maker, setMaker] = useState("");               
  const [origin, setOrigin] = useState("");             
  const [basicDesc, setBasicDesc] = useState("");       
  const [color, setColor] = useState("");               
  const [components, setComponents] = useState("");     
  const [material, setMaterial] = useState("");         
  const [manufactureCountry, setManufactureCountry] = useState(""); 
  const [asTel, setAsTel] = useState("");               

  // 상품 품절 여부: 라디오 2개로 ("selling" / "soldOut")
  const [productStatus, setProductStatus] = useState("selling");

  // 재고관련
  const [stock, setStock] = useState("");             
  const [stockNotify, setStockNotify] = useState(""); 
  const [minPurchase, setMinPurchase] = useState(""); 
  const [maxPurchase, setMaxPurchase] = useState(""); 

  // (3) 이미지 등록
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);

  // (4) 옵션 정보
  const [options, setOptions] = useState([{ optionName: "", optionValue: "" }]);

  // (5) 상세 설명
  const [description, setDescription] = useState("");

  // (6) 배송 정보
  const [shippingFee, setShippingFee] = useState("");

  // (7) 추가 항목 (쿠폰)
  const [coupon, setCoupon] = useState("");

  // 임시저장 버튼
  const handleTempSave = () => {
    alert("임시 저장되었습니다!");
  };

  // 폼 제출 (등록하기)
  const handleRegister = (e) => {
    e.preventDefault();
    const productData = {
      // 1) 카테고리
      category1, category2,

      // 2) 기존 기본 정보
      productCode, brand, modelName, price, cost, discount,

      // 새로 추가된 기본 정보
      maker, origin, basicDesc, color, components, material, manufactureCountry,
      asTel,
      productStatus, // 라디오 (판매중 / 품절)
      stock, stockNotify, minPurchase, maxPurchase,

      // 3) 이미지
      mainImage,
      subImages, // multiple files

      // 4) 옵션
      options,

      // 5) 상세설명
      description,

      // 6) 배송 (shippingFee)
      shippingFee,

      // 7) 추가 항목 (쿠폰만 남기고 태그 제거)
      coupon
    };
    console.log("등록할 데이터:", productData);
    alert("등록 완료!");
  };

  // 옵션 추가 로직
  const addOption = () => {
    setOptions([...options, { optionName: "", optionValue: "" }]);
  };

  // 옵션 수정 로직
  const updateOption = (idx, field, value) => {
    const newOpts = [...options];
    newOpts[idx][field] = value;
    setOptions(newOpts);
  };

  // 파일 선택 시
  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };
  const handleSubImagesChange = (e) => {
    if (e.target.files) {
      setSubImages([...e.target.files]);
    }
  };

  return (
    <div className={styles.adminProductRegister}>
      {/* 상단 바 */}
      <div className={styles.topBar}>
        <h2 className={styles.pageTitle}>상품 입력</h2>
        <div className={styles.topBarButtons}>
          <button type="button" className={styles.tempButton} onClick={handleTempSave}>
            임시저장
          </button>
          <button form="productForm" type="submit" className={styles.mainButton}>
            등록하기
          </button>
        </div>
      </div>

      {/* 구분선 */}
      <div className={styles.topBarDivider} />

      <form id="productForm" onSubmit={handleRegister} className={styles.registerForm}>

        {/* (1) 상품카테고리 설정 */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>상품카테고리 설정</h3>
          <div className={styles.formGrid}>
            <div className={styles.formLabel}>카테고리 설정</div>
            <div className={styles.formInput}>
              <select
                value={category1}
                onChange={(e) => setCategory1(e.target.value)}
                style={{ marginRight: "8px" }}
              >
                <option value="">1차 카테고리</option>
                <option value="top">상의</option>
                <option value="bottom">하의</option>
                <option value="outer">아우터</option>
              </select>

              <select
                value={category2}
                onChange={(e) => setCategory2(e.target.value)}
              >
                <option value="">2차 카테고리</option>
                <option value="short-sleeve">반팔</option>
                <option value="long-sleeve">긴팔</option>
                <option value="hoodie">후드</option>
              </select>
            </div>
          </div>
        </section>

        {/* (2) 기본 정보 */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>기본 정보</h3>
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

            {/* 추가 필드 */}
            <div className={styles.formLabel}>제조사</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) (주)OOO"
                value={maker}
                onChange={(e) => setMaker(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>원산지</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 국내"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>기본 설명</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="간단한 한 줄 설명"
                value={basicDesc}
                onChange={(e) => setBasicDesc(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>색상</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 블랙, 화이트"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>구성품</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 본체, 충전기, 설명서"
                value={components}
                onChange={(e) => setComponents(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>주요소재</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 면 100%"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>제조국</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 한국"
                value={manufactureCountry}
                onChange={(e) => setManufactureCountry(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>A/S 전화번호</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 1588-0000"
                value={asTel}
                onChange={(e) => setAsTel(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>상품 품절 여부</div>
            <div className={styles.formInput}>
              {/* 라디오 2개 */}
              <label className={styles.radioBox}>
                <input
                  type="radio"
                  name="productStatus"
                  value="selling"
                  checked={productStatus === "selling"}
                  onChange={(e) => setProductStatus(e.target.value)}
                />
                <span>판매중</span>
              </label>
              <label className={styles.radioBox}>
                <input
                  type="radio"
                  name="productStatus"
                  value="soldOut"
                  checked={productStatus === "soldOut"}
                  onChange={(e) => setProductStatus(e.target.value)}
                />
                <span>품절</span>
              </label>
            </div>

            <div className={styles.formLabel}>재고 수량</div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="예) 100"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>재고통보수량</div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="재고가 이 수량 이하가 되면 알림"
                value={stockNotify}
                onChange={(e) => setStockNotify(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>최소구매수량</div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="예) 1"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>최대구매수량</div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="예) 10"
                value={maxPurchase}
                onChange={(e) => setMaxPurchase(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* (3) 이미지 등록 */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>이미지 등록</h3>
          <div className={styles.formGrid}>
            <div className={styles.formLabel}>메인 이미지</div>
            <div className={styles.formInput}>
              {/* 커스텀 스타일 .fileInput 사용 */}
              <input
                className={styles.fileInput}
                type="file"
                onChange={handleMainImageChange}
              />
            </div>

            <div className={styles.formLabel}>추가 이미지</div>
            <div className={styles.formInput}>
              <input
                className={styles.fileInput}
                type="file"
                multiple
                onChange={handleSubImagesChange}
              />
            </div>
          </div>
        </section>

        {/* (4) 옵션 정보 */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>옵션 정보</h3>
          {options.map((opt, idx) => (
            <div className={styles.formGrid} key={idx}>
              <div className={styles.formLabel}>옵션명</div>
              <div className={styles.formInput}>
                <input
                  type="text"
                  placeholder="예) 색상"
                  value={opt.optionName}
                  onChange={(e) => updateOption(idx, "optionName", e.target.value)}
                />
              </div>

              <div className={styles.formLabel}>옵션값</div>
              <div className={styles.formInput}>
                <input
                  type="text"
                  placeholder="예) 블랙"
                  value={opt.optionValue}
                  onChange={(e) => updateOption(idx, "optionValue", e.target.value)}
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addOption} className={styles.subButton}>
            옵션 추가
          </button>
        </section>

        {/* (5) 상세 설명 */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>상세 설명</h3>
          <div className={styles.formGrid}>
            <div className={styles.formLabel}>설명입력</div>
            <div className={styles.formInput}>
              <textarea
                rows="5"
                placeholder="상품 상세 설명을 입력하세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", resize: "vertical" }}
              />
            </div>
          </div>
        </section>

        {/* (6) 배송 정보 */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>배송 정보</h3>
          <div className={styles.formGrid}>
            <div className={styles.formLabel}>배송비</div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="예) 3000"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
              />
            </div>

            <div className={styles.formLabel}>재고수량</div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="예) 100"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* (7) 추가 항목 (태그 부분 삭제 → 쿠폰만 남김) */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>추가 항목</h3>
          <div className={styles.formGrid}>
            <div className={styles.formLabel}>쿠폰</div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 10% 할인쿠폰"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
            </div>
          </div>
        </section>

      </form>
    </div>
  );
}

export default AdminProductRegister;
