import React, { useState } from "react";
import styles from "./AdminProductRegister.module.css";

function AdminProductRegister() {
  // (1) 카테고리 설정
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");

  // (2) 기본 정보
  const [productCode, setProductCode] = useState("");
  const [brand, setBrand] = useState("");
  const [modelName, setModelName] =useState("");
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

  // 상품 품절 여부 (라디오: "selling" 또는 "soldOut")
  const [productStatus, setProductStatus] = useState("selling");

  // 재고 관련
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

  // 로컬 스토리지에서 JWT 토큰 가져오기
  const getToken = () => localStorage.getItem("token");

  // 폼 데이터 → 백엔드 API에 맞는 payload로 변환
  const transformPayload = () => {
    return {
      categoryCode: `${category1}-${category2}`,
      productCode,
      brand,
      productName: modelName,
      price: Number(price),
      costPrice: Number(cost),
      discount: Number(discount),
      manufacturer: maker,
      origin,
      description: basicDesc,
      color,
      components,
      material,
      size: "", // 필요시 추가
      shippingInstallationFee: Number(shippingFee),
      asPhoneNumber: asTel,
      marketPrice: Number(cost) * (discount ? (100 - Number(discount)) / 100 : 1),
      outOfStock: productStatus === "soldOut",
      stock: Number(stock),
      stockNotificationThreshold: Number(stockNotify),
      minPurchase: Number(minPurchase),
      maxPurchase: Number(maxPurchase),
      productOptions: options.map((opt) => ({
        optionName: opt.optionName,
        optionValues: [opt.optionValue],
      })),
      additionalOptions: [],
      couponApplicable: coupon ? true : false,
    };
  };

  // 이미지 업로드 함수 (메인/서브 이미지 모두 처리)
  const uploadImage = async (imageFile, productId, isMainImage) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("metadata", JSON.stringify({ productId, isMainImage }));

    try {
      const response = await fetch("http://localhost:8080/api/v1/images/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`, // JWT 토큰을 헤더에 추가
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("이미지 업로드 실패");
      }
      const data = await response.json();
      console.log("이미지 업로드 결과:", data);
      return data;
    } catch (error) {
      console.error("이미지 업로드 에러:", error);
    }
  };

  // 폼 제출 (등록하기)
  const handleRegister = async (e) => {
    e.preventDefault();
    const payload = transformPayload();
    console.log("전송할 payload:", payload);

    try {
      // 제품 등록 API 호출
      const productResponse = await fetch("http://localhost:8080/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!productResponse.ok) {
        throw new Error("제품 등록에 실패했습니다.");
      }
      // API 응답에 따라 productId를 추출 (응답 구조에 따라 조정 필요)
      const productData = await productResponse.json();
      console.log("등록된 제품 정보:", productData);
      const productId = productData; // 예시: 실제 응답에서 productId 필드를 사용

      // 이미지 업로드: 메인 이미지가 있으면 업로드
      if (mainImage) {
        await uploadImage(mainImage, productId, true);
      }
      // 추가 이미지가 있으면 각각 업로드
      if (subImages.length > 0) {
        for (let file of subImages) {
          await uploadImage(file, productId, false);
        }
      }
      alert("제품 등록 완료!");
    } catch (error) {
      console.error("제품 등록 중 에러:", error);
      alert("제품 등록 중 오류가 발생했습니다.");
    }
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

  // 파일 선택 핸들러
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

          {/* (7) 추가 항목 (쿠폰) */}
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
