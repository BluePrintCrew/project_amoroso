import React, { useRef, useState } from "react";

import { API_BASE_URL } from "../../MyPage/api";
import styles from "./AdminProductRegister.module.css";

// --- 카테고리 매핑 테이블
const categoryMap = {
  LIVING: [
    { label: "소파", value: "LIV_SOFA" },
    { label: "장식장", value: "LIV_DISPLAY" },
    { label: "탁자", value: "LIV_TABLE" },
  ],
  BEDROOM: [
    { label: "침대", value: "BED_BED" },
    { label: "침대 깔판", value: "BED_BASE" },
    { label: "협탁", value: "BED_NIGHTSTAND" },
  ],
  KITCHEN: [{ label: "식탁 & 의자", value: "KIT_DINING" }],
  OFFICE: [
    { label: "책상", value: "OFF_DESK" },
    { label: "의자", value: "OFF_CHAIR" },
    { label: "책장", value: "OFF_BOOKSHELF" },
  ],
  DRESSING: [
    { label: "장롱", value: "DRESS_WARDROBE" },
    { label: "화장대", value: "DRESS_TABLE" },
    { label: "드레스", value: "DRESS_DRESSER" },
    { label: "서랍장", value: "DRESS_DRAWER" },
  ],
  ETC: [
    { label: "소품", value: "ETC_DECOR" },
    { label: "벽걸이 거울", value: "ETC_WALL_MIRROR" },
    { label: "액세서리", value: "ETC_ACCESSORY" },
    { label: "거울", value: "ETC_GENERAL_MIRROR" },
  ],
};

function AdminProductRegister() {
  // (1) 카테고리 상태
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");

  // (2) 기본 정보
  const [productCode, setProductCode] = useState("");
  const [brand, setBrand] = useState("");
  const [modelName, setModelName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [discount, setDiscount] = useState("");

  const [maker, setMaker] = useState("");
  const [origin, setOrigin] = useState("");
  const [basicDesc, setBasicDesc] = useState("");
  const [color, setColor] = useState("");
  const [components, setComponents] = useState("");
  const [material, setMaterial] = useState("");
  const [manufactureCountry, setManufactureCountry] = useState("");
  const [asTel, setAsTel] = useState("");

  const [productStatus, setProductStatus] = useState("selling");

  const [stock, setStock] = useState("");
  const [stockNotify, setStockNotify] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [maxPurchase, setMaxPurchase] = useState("");

  // (3) 이미지 등록
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [detailImages, setDetailImages] = useState([]);

  // 파일 입력 Ref (서브/디테일)
  const subInputRef = useRef(null);
  const detailInputRef = useRef(null);

  // (4) 옵션 정보
  const [options, setOptions] = useState([]);

  // (5) 상세 설명
  const [description, setDescription] = useState("");

  // (6) 배송 정보
  const [shippingFee, setShippingFee] = useState("");

  // (7) 쿠폰 여부
  const [couponApplicable, setCouponApplicable] = useState(false);

  // 임시저장
  const handleTempSave = () => {
    alert("임시 저장되었습니다!");
  };

  const getToken = () => localStorage.getItem("access_token");

  // Payload 변환
  const transformPayload = () => {
    return {
      categoryCode: category2,
      productCode,
      brand,
      productName: modelName,
      marketPrice: Number(price),
      costPrice: Number(cost),
      discountRate: Number(discount),
      manufacturer: maker,
      origin,
      description: basicDesc,
      color,
      components,
      material,
      size: "",
      shippingInstallationFee: Number(shippingFee),
      asPhoneNumber: asTel,
      // marketPrice: Number(cost) * (discount ? (100 - Number(discount)) / 100 : 1),
      outOfStock: productStatus === "soldOut",
      stock: Number(stock),
      stockNotificationThreshold: Number(stockNotify),
      minPurchase: Number(minPurchase),
      maxPurchase: Number(maxPurchase),
      productOptions: options.map((opt) => ({
        optionName: opt.optionName,
        optionValues: opt.optionValues.filter((val) => val.trim() !== ""),
      })),
      additionalOptions: [],
      couponApplicable: couponApplicable,
    };
  };

  // 이미지 업로드
  const uploadImage = async (imageFile, productId, imageType, imageOrder) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const metadataBlob = new Blob(
      [JSON.stringify({ productId, imageType, imageOrder })],
      { type: "application/json" }
    );
    formData.append("metadata", metadataBlob, "metadata.json");

    try {
      console.log(
        "이미지 업로드 시도:",
        imageFile.name,
        "유형:",
        imageType,
        "순서:",
        imageOrder
      );
      const response = await fetch(`${API_BASE_URL}/api/v1/images/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
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

  // 등록
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!category2 || !productCode || !modelName || !price || !brand) {
      alert("필수 항목을 모두 채워주세요");
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      alert("가격은 0보다 큰 값이어야 합니다.");
      return;
    }

    if (isNaN(Number(cost)) || Number(cost) <= 0) {
      alert("원가는 0보다 큰 숫자여야 합니다.");
      return;
    }

    if (
      isNaN(Number(discount)) ||
      Number(discount) < 0 ||
      Number(discount) > 100
    ) {
      alert("할인율은 0 이상 100 이하의 숫자여야 합니다.");
      return;
    }

    // 옵션 검증
    if (options.length > 0) {
      const hasInvalidOption = options.some(
        (opt) =>
          !opt.optionName.trim() || // 옵션명 비어있거나 공백
          opt.optionValues.some((val) => !val.trim()) // 옵션값 중 비어있는 것
      );

      if (hasInvalidOption) {
        alert("옵션명 또는 옵션값에 비어있는 항목이 있습니다.");
        return;
      }
    }

    const payload = transformPayload();
    console.log("(디버그) 전송할 payload:", payload);

    try {
      // 1) 상품 등록
      const productResponse = await fetch(`${API_BASE_URL}/api/v1/products/`, {
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

      // 2) productId 반환
      const productData = await productResponse.json();
      console.log("(디버그) 등록된 제품 정보:", productData);
      const productId = productData; // 실제 백엔드 응답 구조에 맞게 수정

      // 3) 이미지 업로드
      // 메인 이미지
      if (mainImage) {
        await uploadImage(mainImage, productId, "MAIN", 0);
      }

      // 서브 이미지 (orderNum = index)
      if (subImages.length > 0) {
        // 최대 6장
        const validSubImages = subImages.slice(0, 6);
        await Promise.all(
          validSubImages.map((file, index) =>
            uploadImage(file, productId, "SUB", index)
          )
        );
      }

      // 상세(디테일) 이미지 (orderNum = index)
      if (detailImages.length > 0) {
        // 최대 8장
        const validDetailImages = detailImages.slice(0, 8);
        await Promise.all(
          validDetailImages.map((file, index) =>
            uploadImage(file, productId, "DETAIL", index)
          )
        );
      }

      // 완료
      alert("제품 등록 완료!");
    } catch (error) {
      console.error("제품 등록 중 에러:", error);
      alert("제품 등록 중 오류가 발생했습니다.");
    }
  };

  // 옵션 추가
  const addOption = () => {
    setOptions([...options, { optionName: "", optionValues: [""] }]);
  };

  // 옵션 변경
  const updateOption = (idx, field, value) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === idx ? { ...opt, [field]: value } : opt))
    );
  };

  // 메인 이미지 선택
  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  // --- 서브 이미지 추가 ---
  const handleAddSubImageClick = () => {
    if (subInputRef.current) {
      subInputRef.current.click(); // 파일 선택창 열기
    }
  };

  const handleSubImagesChange = (e) => {
    if (e.target.files) {
      // 새로 선택된 파일들 배열
      const newFiles = Array.from(e.target.files);
      // 기존 배열 + 새 파일들
      setSubImages((prev) => [...prev, ...newFiles]);
      // input value 초기화 (동일 파일 재선택 가능)
      e.target.value = "";
    }
  };

  // 서브 이미지 제거
  const removeSubImage = (index) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- 디테일 이미지 추가 ---
  const handleAddDetailImageClick = () => {
    if (detailInputRef.current) {
      detailInputRef.current.click();
    }
  };

  const handleDetailImagesChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDetailImages((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
  };

  // 디테일 이미지 제거
  const removeDetailImage = (index) => {
    setDetailImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.adminProductRegister}>
      <div className={styles.topBar}>
        <h2 className={styles.pageTitle}>상품 입력</h2>
        <div className={styles.topBarButtons}>
          <button
            type="button"
            className={styles.tempButton}
            onClick={handleTempSave}
          >
            임시저장
          </button>
          <button
            form="productForm"
            type="submit"
            className={styles.mainButton}
          >
            등록하기
          </button>
        </div>
      </div>

      <div className={styles.topBarDivider} />

      <form
        id="productForm"
        onSubmit={handleRegister}
        className={styles.registerForm}
      >
        {/* (1) 상품카테고리 설정 */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>상품카테고리 설정</h3>
          <div className={styles.formGrid}>
            <div className={styles.formLabel}>
              1차 카테고리<span className={styles.required}>*</span>
            </div>
            <div className={styles.formInput}>
              <select
                value={category1}
                onChange={(e) => {
                  setCategory1(e.target.value);
                  setCategory2("");
                }}
              >
                <option value="">-- 선택 --</option>
                <option value="LIVING">거실</option>
                <option value="BEDROOM">침실</option>
                <option value="KITCHEN">주방</option>
                <option value="OFFICE">홈오피스</option>
                <option value="DRESSING">드레스룸</option>
                <option value="ETC">기타</option>
              </select>
            </div>

            <div className={styles.formLabel}>
              2차 카테고리<span className={styles.required}>*</span>
            </div>
            <div className={styles.formInput}>
              {category1 ? (
                <select
                  value={category2}
                  onChange={(e) => setCategory2(e.target.value)}
                >
                  <option value="">-- 선택 --</option>
                  {categoryMap[category1].map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </select>
              ) : (
                <select disabled>
                  <option value="">1차 카테고리를 먼저 선택하세요</option>
                </select>
              )}
            </div>
          </div>
        </section>

        {/* (2) 기본 정보 */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>기본 정보</h3>
          <div className={styles.formGrid}>
            <div className={styles.formLabel}>
              상품코드 <span className={styles.required}>*</span>
            </div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 17324T4190"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
            </div>
            <div className={styles.formLabel}>
              브랜드<span className={styles.required}>*</span>
            </div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) AMOROSO"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className={styles.formLabel}>
              모델명<span className={styles.required}>*</span>
            </div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="예) 2023신상 모델명"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>
            <div className={styles.formLabel}>
              가격<span className={styles.required}>*</span>
            </div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="숫자만 입력"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className={styles.formLabel}>
              원가<span className={styles.required}>*</span>
            </div>
            <div className={styles.formInput}>
              <input
                type="number"
                placeholder="예) 50000"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div className={styles.formLabel}>
              할인율<span className={styles.required}>*</span>
            </div>
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
            {/* 서브 이미지 (커스텀 버튼 + hidden input) */}
            <div className={styles.formLabel}>추가 이미지 (최대 6장)</div>
            <div className={styles.formInput}>
              <button
                type="button"
                onClick={handleAddSubImageClick}
                className={styles.subButton}
              >
                파일 추가
              </button>
              <input
                type="file"
                ref={subInputRef}
                style={{ display: "none" }}
                multiple
                onChange={handleSubImagesChange}
              />
            </div>
          </div>

          {/* 서브 이미지 미리보기 */}
          {subImages.length > 0 && (
            <div className={styles.previewContainer}>
              <h4>서브 이미지 미리보기</h4>
              <ul>
                {subImages.map((file, index) => (
                  <li key={index}>
                    {/* 순서: index+1 */}
                    {index + 1}. {file.name}{" "}
                    <button
                      type="button"
                      onClick={() => removeSubImage(index)}
                      style={{ marginLeft: "10px", color: "red" }}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* (3.5) 제품 설명 이미지 등록 */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            제품 설명 이미지 등록 (최대 8장)
          </h3>
          <div className={styles.formGrid}>
            <div className={styles.formLabel}>설명 이미지</div>
            <div className={styles.formInput}>
              <button
                type="button"
                onClick={handleAddDetailImageClick}
                className={styles.subButton}
              >
                파일 추가
              </button>
              <input
                type="file"
                ref={detailInputRef}
                style={{ display: "none" }}
                multiple
                onChange={handleDetailImagesChange}
              />
            </div>
          </div>
          {/* 제품 설명 이미지 미리보기 */}
          {detailImages.length > 0 && (
            <div className={styles.previewContainer}>
              <h4>제품 설명 이미지 미리보기</h4>
              <ul>
                {detailImages.map((file, index) => (
                  <li key={index}>
                    {index + 1}. {file.name}{" "}
                    <button
                      type="button"
                      onClick={() => removeDetailImage(index)}
                      style={{ marginLeft: "10px", color: "red" }}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* (4) 옵션 정보 */}
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>옵션 정보</h3>
          {options.map((opt, optIdx) => (
            <div className={styles.optionBlock} key={optIdx}>
              <button
                type="button"
                onClick={() => {
                  const newOptions = options.filter((_, i) => i !== optIdx);
                  setOptions(newOptions);
                }}
                className={styles.deleteOptionBlockBtn}
              >
                ×
              </button>
              <div className={styles.formGrid} key={optIdx}>
                <div className={styles.formLabel}>옵션명</div>
                <div className={styles.formInput}>
                  <input
                    type="text"
                    placeholder="예) 색상"
                    value={opt.optionName}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[optIdx].optionName = e.target.value;
                      setOptions(newOptions);
                    }}
                  />
                </div>

                <div className={styles.formLabel}>옵션값들</div>
                <div className={styles.formInput}>
                  {opt.optionValues.map((value, valIdx) => (
                    <div
                      key={valIdx}
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="예) 블랙"
                        value={value}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[optIdx].optionValues[valIdx] =
                            e.target.value;
                          setOptions(newOptions);
                        }}
                      />
                      {opt.optionValues.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = [...options];
                            newOptions[optIdx].optionValues.splice(valIdx, 1);
                            setOptions(newOptions);
                          }}
                          className={styles.deleteOptionValueBtn}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = [...options];
                      newOptions[optIdx].optionValues.push("");
                      setOptions(newOptions);
                    }}
                    className={styles.subButton}
                  >
                    옵션값 추가
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addOption}
            className={styles.addOptionButton}
          >
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
            <div className={styles.formLabel}>쿠폰 사용 여부</div>
            <div className={styles.formInput}>
              <label className={styles.radioBox}>
                <input
                  type="radio"
                  name="couponApplicable"
                  value="true"
                  checked={couponApplicable === true}
                  onChange={() => setCouponApplicable(true)}
                />
                <span>사용 허용</span>
              </label>
              <label className={styles.radioBox}>
                <input
                  type="radio"
                  name="couponApplicable"
                  value="false"
                  checked={couponApplicable === false}
                  onChange={() => setCouponApplicable(false)}
                />
                <span>사용 불가</span>
              </label>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

export default AdminProductRegister;
