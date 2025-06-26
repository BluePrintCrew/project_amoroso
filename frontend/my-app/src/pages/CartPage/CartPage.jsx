import './CartPage.css';

import React, { useEffect, useState } from 'react';

import CartFooter from './CartFooter';
import CartSummary from '../../components/CartSummary/CartSummary';
import CartTable from './CartTable';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('access_token');

    // 토큰이 없으면 에러 표시
    if (!token) {
      setError(new Error('로그인이 필요합니다.'));
      setLoading(false);
      return;
    }

    // 장바구니 항목 가져오기
    fetchCartItems(token);
  }, []);

  const fetchCartItems = async (token) => {
    try {
      // 장바구니 API 호출
      const cartResponse = await axios.get(`${API_BASE_URL}/api/v1/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('장바구니 API 원본 응답:', cartResponse.data);

      if (!cartResponse.data || cartResponse.data.length === 0) {
        console.log('장바구니가 비어 있습니다.');
        setCartItems([]);
        setLoading(false);
        return;
      }

      // 장바구니 응답에서 제품 ID 추출
      const productIds = cartResponse.data
          .map((item) => item.productId)
          .filter((id) => id);
      console.log('장바구니에 있는 제품 ID:', productIds);

      if (productIds.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      // 각 제품별로 상세 정보 가져오기 (이미지 URL 등 포함)
      const enrichedItems = await Promise.all(
          cartResponse.data.map(async (cartItem) => {
            // 제품 ID가 없으면 기본 객체 반환
            if (!cartItem.productId) {
              return {
                id: cartItem.cartItemId || 0,
                name: cartItem.productName || '알 수 없는 상품',
                price: cartItem.discountPrice || cartItem.totalPrice || 0,
                originalPrice: cartItem.originalPrice || cartItem.totalPrice || 0,
                quantity: cartItem.quantity || 1,
                imageUrl: '',
                // 배송비 정보 추가
                shippingFee: cartItem.shippingInstallationFee || 0,
                shipping: cartItem.shippingInstallationFee > 0
                    ? `배송비 ${cartItem.shippingInstallationFee.toLocaleString()}원`
                    : '무료배송',
                // 기타 필드들...
                originalData: cartItem,
              };
            }

            try {
              // 제품 상세 정보 API 호출
              const productResponse = await axios.get(
                  `${API_BASE_URL}/api/v1/products/${cartItem.productId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  }
              );

              console.log(
                  `제품 ID ${cartItem.productId} 상세 정보:`,
                  productResponse.data
              );

              const productData = productResponse.data;

              // 이미지 URL 처리
              let imageUrl = '';

              if (productData.mainImageURL) {
                const mainImage = productData.mainImageURL;
                imageUrl = mainImage.startsWith('http')
                    ? mainImage
                    : `${API_BASE_URL}/api/v1/images/${mainImage.split('/').pop()}`;
              } else if (productData.primaryImageURL) {
                const primaryImage = productData.primaryImageURL;
                imageUrl = primaryImage.startsWith('http')
                    ? primaryImage
                    : `${API_BASE_URL}/api/v1/images/${primaryImage
                        .split('/')
                        .pop()}`;
              }

              // 통합 객체 반환
              return {
                id: cartItem.cartItemId,
                name:
                    cartItem.productName ||
                    productData.productName ||
                    '제품명 없음',
                price:
                    cartItem.discountPrice ||
                    cartItem.totalPrice ||
                    productData.discountPrice ||
                    0,
                originalPrice:
                    cartItem.originalPrice || productData.marketPrice || 0,
                quantity: cartItem.quantity || 1,
                imageUrl, // 제품 상세에서 가져온 이미지 URL
                productId: cartItem.productId,
                additionalOptionName: cartItem.additionalOptionName || '',
                additionalOptionId: cartItem.additionalOptionId || 0,
                additionalPrice: cartItem.additionalPrice || 0,
                productOptionName: cartItem.productOptionName || '',
                productOptionId: cartItem.productOptionId || 0,
                selectedOptionValue: cartItem.selectedOptionValue || '',
                // 배송비 정보 추가
                shippingFee: cartItem.shippingInstallationFee || 0,
                shipping: cartItem.shippingInstallationFee > 0
                    ? `배송비 ${cartItem.shippingInstallationFee.toLocaleString()}원`
                    : '무료배송',
                originalCartData: cartItem,
                originalProductData: productData,
              };
            } catch (productError) {
              console.error(
                  `제품 ID ${cartItem.productId} 정보 가져오기 실패:`,
                  productError
              );

              // 제품 정보를 가져오지 못해도 장바구니 항목은 표시
              return {
                id: cartItem.cartItemId,
                name: cartItem.productName || '제품 정보 없음',
                price: cartItem.discountPrice || cartItem.totalPrice || 0,
                originalPrice: cartItem.originalPrice || 0,
                quantity: cartItem.quantity || 1,
                imageUrl: '',
                // 배송비 정보 추가
                shippingFee: cartItem.shippingInstallationFee || 0,
                shipping: cartItem.shippingInstallationFee > 0
                    ? `배송비 ${cartItem.shippingInstallationFee.toLocaleString()}원`
                    : '무료배송',
                productId: cartItem.productId,
                originalData: cartItem,
              };
            }
          })
      );

      console.log('완성된 장바구니 항목:', enrichedItems);
      setCartItems(enrichedItems);
      setLoading(false);
    } catch (err) {
      console.error('장바구니 데이터 로딩 오류:', err);
      setError(err);
      setLoading(false);
    }
  };

  const handleOrder = (itemsToOrder) => {
    const safeItems = Array.isArray(itemsToOrder[0])
        ? itemsToOrder.flat()
        : itemsToOrder;

    if (itemsToOrder.length === 0) {
      alert('주문할 상품이 없습니다.');
      return;
    }

    const mappedItems = safeItems.map((item) => ({
      productId: item.productId,
      productName: item.name,
      discountPrice: item.price,
      marketPrice: item.originalPrice,
      mainImageURL: item.imageUrl,
      quantity: item.quantity,
      shippingInstallationFee: item.shippingFee || 0, // 배송비 정보 추가
    }));

    // OrderForm이 기대하는 구조로 데이터 변경
    const orderData = {
      orderItems: mappedItems,
      returnPath: '/cart'
    };

    console.log('주문으로 넘길 데이터:', orderData);
    navigate('/order', { state: orderData });
  };

  if (loading) return <div className="loading-container">로딩 중...</div>;

  if (error) {
    return (
        <div className="cart-page">
          <Header />
          <div className="error-container">
            <h2>오류가 발생했습니다</h2>
            <p>
              {error.message ||
                  '장바구니 데이터를 불러오는 중 오류가 발생했습니다.'}
            </p>
            {error.message === '로그인이 필요합니다.' && (
                <button
                    className="login-button"
                    onClick={() => (window.location.href = '/login')}
                >
                  로그인하기
                </button>
            )}
          </div>
          <Footer />
        </div>
    );
  }

  return (
      <div className="cart-page">
        <Header />
        <h2 className="cart-title">장바구니 ({cartItems.length})</h2>

        {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>장바구니가 비어 있습니다.</p>
              <button
                  className="continue-shopping-btn"
                  onClick={() => (window.location.href = '/')}
              >
                쇼핑 계속하기
              </button>
            </div>
        ) : (
            <>
              <CartTable
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  onSelectionChange={setSelectedIds}
              />
              <div className="cart-information-text">
                <p>
                  • 주문서 안내 내용입니다. 주문서 안내 내용입니다. 주문서 안내
                  내용입니다.
                </p>
              </div>
              <CartSummary cartItems={cartItems} />
              <CartFooter
                  cartItems={cartItems}
                  selectedItems={cartItems.filter((item) =>
                      selectedIds.includes(item.id)
                  )}
                  onOrder={handleOrder}
              />
            </>
        )}

        <Footer />
      </div>
  );
}

export default CartPage;