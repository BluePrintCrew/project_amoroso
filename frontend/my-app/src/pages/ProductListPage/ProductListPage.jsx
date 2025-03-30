import React, { useEffect, useState } from "react";
import "./ProductListPage.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import PageLayout from "../../components/PageLayout/PageLayout";
import homeicon from "../../assets/nav_home.png";
import { API_BASE_URL } from "../MyPage/api";

// Replace hardcoded API_BASE_URL with imported constant
const API_ENDPOINT = `${API_BASE_URL}/api/v1`;

// 카테고리 맵핑
const topCategoryMap = {
  LIVING: "거실",
  BEDROOM: "침실",
  KITCHEN: "주방",
  OFFICE: "사무실",
  DRESSING: "드레스룸",
  ETC: "기타",
};

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

function ProductListPage() {
  const topCategories = Object.keys(categoryMap);
  const [selectedTop, setSelectedTop] = useState(topCategories[0]);
  const [selectedSub, setSelectedSub] = useState("");
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subCategoryList = categoryMap[selectedTop] || [];

  useEffect(() => {
    const firstSub = categoryMap[selectedTop]?.[0]?.value || "";
    setSelectedSub(firstSub);
  }, [selectedTop]);

  useEffect(() => {
    if (!selectedSub) return;
    setLoading(true);
    setError(null);

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/products/?categoryCode=${selectedSub}`);
        if (!response.ok) throw new Error("상품 데이터를 불러오는데 실패했습니다.");
        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 0);
        setTotalItems(data.totalItems || 0);
        return data.products || [];
      } catch (err) {
        setError(err.message);
        setProducts([]);
        return [];
      }
    };

    fetchProducts().finally(() => setLoading(false));
  }, [selectedSub]);

  const handleTopCategoryChange = (e) => {
    const newTop = e.target.value;
    setSelectedTop(newTop);
    const firstSub = categoryMap[newTop]?.[0]?.value || "";
    setSelectedSub(firstSub);
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSub(e.target.value);
  };

  const currentSubCategory = subCategoryList.find((sub) => sub.value === selectedSub);

  return (
    <PageLayout>
      <div className="content-wrapper">
        <nav className="breadcrumb">
          <img src={homeicon} alt="홈 아이콘" className="home-icon" />
          <span className="separator">&gt;</span>
          <span className="category">{topCategoryMap[selectedTop]}</span>
          <span className="separator">&gt;</span>
          <span className="current">{currentSubCategory ? currentSubCategory.label : ""}</span>
        </nav>

        <div className="category-selector">
          <div className="top-category-selector">
            <label>상위 카테고리: </label>
            <select value={selectedTop} onChange={handleTopCategoryChange}>
              {topCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {topCategoryMap[cat]}
                </option>
              ))}
            </select>
          </div>

          <div className="sub-category-selector">
            <label>하위 카테고리: </label>
            <select value={selectedSub} onChange={handleSubCategoryChange}>
              {subCategoryList.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">로딩 중...</p>
        ) : error ? (
          <p className="error-text">❌ {error}</p>
        ) : (
          <>
            <div className="product-count-sort">
              <span className="total-count">전체 {totalItems}건</span>
            </div>

            <div className="product-grid">
              {products.map((prod) => (
                <ProductCard
                  key={prod.productId}
                  product={{
                    ...prod,
                    imageUrl: prod.primaryImageURL || "", // 상품 정보에서 이미지 URL 직접 사용
                  }}
                />
              ))}
            </div>

            <div className="pagination">
              <p>전체 페이지: {totalPages}페이지</p>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default ProductListPage;