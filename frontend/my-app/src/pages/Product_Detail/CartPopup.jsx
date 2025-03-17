import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPopup.css';

// 두 가지 타입의 팝업을 지원하는 컴포넌트
const CartPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName, 
  type = 'cart' // 'cart' 또는 'login'
}) => {
  // Hook은 항상 컴포넌트 최상위 레벨에서 호출해야 함
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  // 로그인 팝업일 경우 로그인 페이지로 이동하는 함수
  const handleLoginRedirect = () => {
    onClose();
    // 현재 페이지 경로를 state로 전달하여 로그인 후 돌아올 수 있도록 함
    navigate('/login', { state: { from: window.location.pathname } });
  };

  return (
    <div className="cartPopupOverlay">
      <div className="cartPopup">
        <div className="cartPopupHeader">
          <div className="cartPopupTitle">
            {type === 'cart' ? '장바구니 확인' : '로그인 필요'}
          </div>
          <button className="cartPopupClose" onClick={onClose}>×</button>
        </div>
        
        <div className="cartPopupContent">
          {type === 'cart' ? (
            <p className="cartPopupMessage">
              <strong>{productName}</strong><br />
              선택하신 상품이 장바구니에 추가되었습니다.<br />
              지금 장바구니로 이동하시겠습니까?
            </p>
          ) : (
            <p className="cartPopupMessage">
              장바구니 기능은 로그인 후 이용 가능합니다.<br />
              로그인 페이지로 이동하시겠습니까?
            </p>
          )}
        </div>
        
        <div className="cartPopupFooter">
          <button 
            className="cartPopupButton cartPopupCancelButton" 
            onClick={onClose}
          >
            {type === 'cart' ? '계속 쇼핑' : '취소'}
          </button>
          <button 
            className="cartPopupButton cartPopupConfirmButton" 
            onClick={type === 'cart' ? onConfirm : handleLoginRedirect}
          >
            {type === 'cart' ? '장바구니 이동' : '로그인하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;