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
          `${API_BASE_URL}/api/v1/sellers/products?page=1&size=20&sortBy=createdAt&order=desc`,
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
        if (response.data && Array.isArray(response.data.content)) {
          productList = response.data.content;
        }
        
        // 데이터 매핑 전처리
        const processedProducts = productList.map(product => ({
          ...product
        }));
        setProducts(processedProducts);
        setTotal(response.data.totalElements || processedProducts.length);
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
              <th>상품 ID</th>
              <th>상품명</th>
              <th>상품 코드</th>
              <th>판매 가격</th>
              <th>시중 가격</th>
              <th>카테고리</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product, idx) => (
                <tr key={product.productId || idx}>
                  <td colSpan={8} style={{fontFamily: 'monospace', fontSize: '0.95rem'}}>{JSON.stringify(product)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
                  상품이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductTable;