import React from 'react';
import searchIcon from '../../../assets/search.png';
import styles from './ProductTable.module.css';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    code: '1387878159',
    name: '[특가~1/26]이현제의 숨막히는 뒷태 (팬티색깔 선택)',
    image: '',
    salePrice: 50000,
    userPrice: 100000,
    stock: 1,
    category: '침대',
    status: '판매중',
  },
  {
    id: 2,
    code: '1387878150',
    name: '[특가~1/26]이현제가 코푼 휴지 (콧물농도 선택)',
    image: '',
    salePrice: 150000,
    userPrice: 200000,
    stock: 2,
    category: '침대',
    status: '미판매',
  },
];

const ProductTable = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.topContent}>
        <h2 className={styles.title}>상품 목록</h2>

        <div className={styles.filterSection}>
          <span>전체 상품: {products.length.toLocaleString()} 개</span>
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

      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>상품 코드</th>
            <th>상품명</th>
            <th>판매 가격</th>
            <th>시중 가격</th>
            <th>재고</th>
            <th>카테고리</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.code}</td>
              <td className={styles.productInfo}>
                <div className={styles.imagePlaceholder} />
                <span>{product.name}</span>
              </td>
              <td>{product.salePrice.toLocaleString()} 원</td>
              <td>{product.userPrice.toLocaleString()} 원</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>
              <td>
                <span
                  className={`${styles.statusTag} ${
                    product.status === '판매중'
                      ? styles.active
                      : styles.inactive
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td>
                <div className={styles.buttonSection}>
                  <button className={styles.actionBtn}>✏️</button>
                  <button className={styles.actionBtn}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
