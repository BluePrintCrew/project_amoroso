import './ProductListPage.css';

import React, { useEffect, useState } from 'react';

import { API_BASE_URL } from '../MyPage/api';
import PageLayout from '../../components/PageLayout/PageLayout';
import ProductCard from '../../components/ProductCard/ProductCard';
import homeicon from '../../assets/nav_home.png';
import { useSearchParams } from 'react-router-dom';

// Replace hardcoded API_BASE_URL with imported constant
const API_ENDPOINT = `${API_BASE_URL}/api/v1`;

// 카테고리 맵핑
const topCategoryMap = {
  LIVING: '거실',
  BEDROOM: '침실',
  KITCHEN: '주방',
  OFFICE: '사무실',
  DRESSING: '드레스룸',
  ETC: '기타',
};

const categoryMap = {
  LIVING: [
    { label: '소파', value: 'LIV_SOFA' },
    { label: '장식장', value: 'LIV_DISPLAY' },
    { label: '탁자', value: 'LIV_TABLE' },
  ],
  BEDROOM: [
    { label: '침대', value: 'BED_BED' },
    { label: '침대 깔판', value: 'BED_BASE' },
    { label: '협탁', value: 'BED_NIGHTSTAND' },
  ],
  KITCHEN: [{ label: '식탁 & 의자', value: 'KIT_DINING' }],
  OFFICE: [
    { label: '책상', value: 'OFF_DESK' },
    { label: '의자', value: 'OFF_CHAIR' },
    { label: '책장', value: 'OFF_BOOKSHELF' },
  ],
  DRESSING: [
    { label: '장롱', value: 'DRESS_WARDROBE' },
    { label: '화장대', value: 'DRESS_TABLE' },
    { label: '드레스', value: 'DRESS_DRESSER' },
    { label: '서랍장', value: 'DRESS_DRAWER' },
  ],
  ETC: [
    { label: '소품', value: 'ETC_DECOR' },
    { label: '벽걸이 거울', value: 'ETC_WALL_MIRROR' },
    { label: '액세서리', value: 'ETC_ACCESSORY' },
    { label: '거울', value: 'ETC_GENERAL_MIRROR' },
  ],
};

function ProductListPage() {
  const [searchParams] = useSearchParams();
  const topCategories = Object.keys(categoryMap);
  const initialTop = searchParams.get('top') || topCategories[0];
  const [selectedTop, setSelectedTop] = useState(initialTop);
  const [selectedSub, setSelectedSub] = useState('');
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [size] = useState(12); // 페이지당 상품 수

  const subCategoryList = categoryMap[selectedTop] || [];

  useEffect(() => {
    const firstSub = categoryMap[selectedTop]?.[0]?.value || '';
    setSelectedSub(firstSub);
    setCurrentPage(1); // 카테고리 변경 시 페이지 초기화
  }, [selectedTop]);

  useEffect(() => {
    if (!selectedSub) return;
    setLoading(true);
    setError(null);

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINT}/products/?categoryCode=${selectedSub}&page=${currentPage}&sortBy=${sortBy}&order=${order}&size=${size}`
        );

        if (!response.ok)
          throw new Error('상품 데이터를 불러오는데 실패했습니다.');

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
  }, [selectedSub, currentPage, sortBy, order, size]);

  const handleTopCategoryChange = (topCategory) => {
    setSelectedTop(topCategory);
  };

  const handleSubCategoryChange = (subCategoryValue) => {
    setSelectedSub(subCategoryValue);
    setCurrentPage(1); // 하위 카테고리 변경 시 페이지 초기화
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  };

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setCurrentPage(1); // 정렬 변경 시 페이지 초기화
  };

  // 페이지네이션 렌더링 함수
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 이전 버튼
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="page-button"
          aria-label="이전 페이지"
        >
          &lt;
        </button>
      );
    }

    // 첫 페이지로 가는 버튼
    if (startPage > 1) {
      pages.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="page-button"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="ellipsis">
            ...
          </span>
        );
      }
    }

    // 페이지 번호
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-button ${currentPage === i ? 'active' : ''}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    // 마지막 페이지로 가는 버튼
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="ellipsis">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="page-button"
        >
          {totalPages}
        </button>
      );
    }

    // 다음 버튼
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="page-button"
          aria-label="다음 페이지"
        >
          &gt;
        </button>
      );
    }

    return <div className="pagination-controls">{pages}</div>;
  };

  const currentSubCategory = subCategoryList.find(
    (sub) => sub.value === selectedSub
  );

  return (
    <PageLayout>
      <div className="content-wrapper">
        <nav className="breadcrumb">
          <img src={homeicon} alt="홈 아이콘" className="home-icon" />
          <span className="separator">&gt;</span>
          <span className="category">{topCategoryMap[selectedTop]}</span>
          <span className="separator">&gt;</span>
          <span className="current">
            {currentSubCategory ? currentSubCategory.label : ''}
          </span>
        </nav>

        <div className="category-selector">
          {/* 상위 카테고리 탭 */}
          <div className="top-category-tabs">
            {topCategories.map((category) => (
              <button
                key={category}
                className={`top-category-tab ${
                  selectedTop === category ? 'active' : ''
                }`}
                onClick={() => handleTopCategoryChange(category)}
              >
                {topCategoryMap[category]}
              </button>
            ))}
          </div>

          {/* 하위 카테고리 버튼 */}
          <div className="sub-category-buttons">
            {subCategoryList.map((sub) => (
              <button
                key={sub.value}
                className={`sub-category-button ${
                  selectedSub === sub.value ? 'active' : ''
                }`}
                onClick={() => handleSubCategoryChange(sub.value)}
              >
                {sub.label}
              </button>
            ))}
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
              <div className="sort-menu">
                <button
                  className={
                    sortBy === 'createdAt' && order === 'desc' ? 'active' : ''
                  }
                  onClick={() => handleSortChange('createdAt', 'desc')}
                >
                  최신순
                </button>
                <button
                  className={
                    sortBy === 'marketPrice' && order === 'asc' ? 'active' : ''
                  }
                  onClick={() => handleSortChange('marketPrice', 'asc')}
                >
                  가격 낮은순
                </button>
                <button
                  className={
                    sortBy === 'marketPrice' && order === 'desc' ? 'active' : ''
                  }
                  onClick={() => handleSortChange('marketPrice', 'desc')}
                >
                  가격 높은순
                </button>
              </div>
            </div>

            <div className="product-grid">
              {products.length === 0 ? (
                <p className="no-products">상품이 없습니다.</p>
              ) : (
                products.map((prod) => (
                  <ProductCard
                    key={prod.productId}
                    product={{
                      ...prod,
                      imageUrl: prod.primaryImageURL || '', // 상품 정보에서 이미지 URL 직접 사용
                    }}
                  />
                ))
              )}
            </div>

            <div className="pagination">{renderPagination()}</div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default ProductListPage;
