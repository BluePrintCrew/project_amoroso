import React, { useEffect, useState } from 'react';
import searchIcon from '../../../assets/search.png';
import styles from './ProductTable.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/sellers/products?page=0&size=20&sortBy=createdAt&order=desc`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        
        // API 응답 구조 자세히 디버깅
        console.log('=== API 응답 디버깅 ===');
        console.log('1. 전체 응답:', response);
        console.log('2. 응답 데이터:', response.data);
        console.log('3. 응답 데이터 타입:', typeof response.data);
        console.log('4. 응답 데이터 키:', Object.keys(response.data));
        
        // 응답 데이터 구조 확인 및 매핑
        let productList = [];
        
        // 응답 데이터가 어떤 형태인지 확인
        if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data)) {
            console.log('5. 응답이 배열입니다');
            productList = response.data;
          } else if (response.data.content) {
            console.log('5. 응답이 content 필드를 가진 객체입니다');
            productList = response.data.content;
          } else if (response.data.products) {
            console.log('5. 응답이 products 필드를 가진 객체입니다');
            productList = response.data.products;
          } else if (response.data.items) {
            console.log('5. 응답이 items 필드를 가진 객체입니다');
            productList = response.data.items;
          } else {
            console.log('5. 응답이 다른 형태의 객체입니다:', response.data);
            // 직접 데이터를 배열로 변환
            productList = Object.values(response.data);
          }
        }
        
        // 첫 번째 상품 데이터 자세히 확인
        if (productList.length > 0) {
          const firstProduct = productList[0];
          console.log('=== 첫 번째 상품 데이터 ===');
          console.log('1. 전체 데이터:', firstProduct);
          console.log('2. 모든 키:', Object.keys(firstProduct));
          console.log('3. productCode 값:', firstProduct.productCode);
          console.log('4. code 값:', firstProduct.code);
          console.log('5. 모든 값:', Object.entries(firstProduct));
        }
        
        // 데이터 매핑 전처리
        const processedProducts = productList.map(product => {
          // 각 상품의 모든 필드 확인
          console.log('=== 상품 데이터 매핑 ===');
          console.log('원본 데이터:', product);
          console.log('사용 가능한 필드:', Object.keys(product));
          
          return {
            ...product,
            // 필드명이 다른 경우를 대비한 매핑
            productCode: product.productCode || product.code || product.product_code,
            productName: product.productName || product.name || product.product_name,
            marketPrice: product.marketPrice || product.price || product.market_price,
            stock: product.stock || product.quantity || product.inventory,
            categoryName: product.categoryName || (product.category && product.category.name) || product.category_name
          };
        });
        
        console.log('=== 처리된 상품 목록 ===');
        console.log('처리된 첫 번째 상품:', processedProducts[0]);
        
        setProducts(processedProducts);
        setTotal(Array.isArray(response.data) ? response.data.length :
                response.data.totalItems || response.data.total || processedProducts.length);
      } catch (err) {
        console.error('상품 목록 조회 에러:', err);
        console.error('에러 상세:', err.response?.data);
        setError('상품 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.delete(`${API_BASE_URL}/api/v1/products/${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setProducts(products.filter(p => p.productId !== productId));
      setTotal(prev => prev - 1);
      alert('삭제되었습니다.');
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topContent}>
        <h2 className={styles.title}>상품 목록</h2>

        <div className={styles.filterSection}>
          <span>전체 상품: {total.toLocaleString()} 개</span>
          <select className={styles.dropdown}>
            <option>전체 카테고리</option>
          </select>
          <div className={styles.searchBoxContainer}>
            <input
              type="text"
              className={styles.searchBox}
              placeholder="검색어를 입력하세요"
            />
            <button className={styles.searchButton}>
              <img src={searchIcon} alt="검색"></img>
            </button>
          </div>
          <button className={styles.showAll}>전체보기</button>
          <button className={styles.addProduct} onClick={() => navigate('/admin/register')}>상품 등록</button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>로딩 중...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'red' }}>{error}</div>
      ) : (
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>상품 코드</th>
              <th>상품명</th>
              <th>판매 가격</th>
              <th>시중 가격</th>
              {/* <th>1차 카테고리</th> */}
              <th>카테고리</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
                  상품이 없습니다.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>{product.productName || '-'}</td>
                  <td>{product.marketPrice !== undefined ? product.marketPrice.toLocaleString() + ' 원' : '-'}</td>
                  <td>{product.discountPrice !== undefined ? product.discountPrice.toLocaleString() + ' 원' : '-'}</td>
                  {/* <td>{product.categoryCode ? product.categoryCode.split('_')[0] : '-'}</td> */}
                  <td>{product.categoryName || product.category || (product.category && product.category.name) || '-'}</td>
                  <td>
                    <span
                      className={`${styles.statusTag} ${product.outOfStock ? styles.inactive : styles.active}`}
                    >
                      {product.outOfStock ? '품절' : '판매중'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.buttonSection}>
                      {/*
                      <button
                        className={styles.actionBtn}
                        onClick={() => navigate(`/admin/register?edit=1&id=${product.productId}`)}
                      >
                        <FiEdit2 />
                      </button>
                      */}
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDelete(product.productId)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductTable;