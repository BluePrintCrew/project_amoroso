import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './TopProducts.module.css';
import { API_BASE_URL } from "../../../pages/MyPage/api";

const TopProductsTest = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

        axios.get(`${API_BASE_URL}/api/v1/seller/popular-products`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(res => setProducts(res.data))
            .catch(err => console.error('TopProductsTest fetch error:', err));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>인기상품 TOP 5</h2>
                <select className={styles.dropdown}>
                    <option>연 기준</option>
                </select>
            </div>

            <ul className={styles.productList}>
                {products.map((product) => (
                    <li key={product.productId} className={styles.productItem}>
                        <div className={styles.productInfo}>
                            <div className={styles.imagePlaceholder} />
                            <div>
                                <p className={styles.productName}>{product.productName}</p>
                                <p className={styles.category}>{product.categoryName}</p>
                            </div>
                        </div>
                        <div className={styles.productMeta}>
                            <div className={styles.code}>
                                <p className={styles.codeHeader}>상품 코드</p>
                                <span className={styles.productCode}>{product.productCode}</span>
                            </div>
                            <div className={styles.price}>
                                <p className={styles.priceHeader}>상품 가격</p>
                                <span className={styles.productPrice}>
                  {Number(product.marketPrice).toLocaleString()}원
                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopProductsTest;
