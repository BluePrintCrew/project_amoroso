import React, { useState } from 'react';
import axios from 'axios';
import './ProductQnAWrite.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const ProductQnAWrite = ({ onClose, product, onSubmitSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null); 
  const charCount = content.length;
  const maxChars = 1000;
  
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('문의 제목을 입력해주세요.');
      return;
    }
    
    if (!content.trim()) {
      setError('문의 내용을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('로그인이 필요합니다.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // API 명세서에 맞는 요청 데이터 구성
      const inquiryData = {
        inquiryTitle: title,
        inquiryDescription: content,
        productId: product.id
      };
      
      // 비밀글 처리에 대한 필드가 백엔드에 있다면 추가
      // inquiryData.isSecret = isSecret;
      
      // 문의 등록 API 호출
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/inquiries`,
        inquiryData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('문의 등록 응답:', response.data);
      
      alert('상품 문의가 등록되었습니다.');
      
      // 성공 콜백 실행
      if (typeof onSubmitSuccess === 'function') {
        onSubmitSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('문의 등록 오류:', error);
      setError(error.response?.data?.message || '문의 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        {/* 헤더 */}
        <div className="modal-header">
          <h2>상품 Q&A 작성하기</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {/* 본문 */}
        <div className="modal-body">
          {/* 제목 입력 */}
          <div className="input-container">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력하세요"
              maxLength={100}
              className="title-input"
            />
          </div>
          
          {/* 텍스트 영역 */}
          <div className="textarea-container">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의하실 내용을 입력하세요"
              maxLength={maxChars}
            ></textarea>
            <div className="char-counter">{charCount} / {maxChars}</div>
          </div>
          
          {/* 에러 메시지 */}
          {error && <div className="error-message">{error}</div>}
          
          {/* 체크박스 */}
          <div className="checkbox-container">
            <label>
              <input 
                type="checkbox" 
                checked={isSecret}
                onChange={() => setIsSecret(!isSecret)}
              />
              <span className="checkbox-label">비공개</span>
            </label>
            
            <p className="notice-text">
              문의하신 내용에 대한 답변은 해당 상품의 상세페이지 또는 '마이쇼핑 &gt; 상품Q&A'에서 확인하실 수 있습니다.
            </p>
          </div>
        </div>
        
        {/* 버튼 영역 - 테이블 레이아웃 사용 */}
        <table className="button-table">
          <tbody>
            <tr>
              <td className="cancel-cell">
                <button className="cancel-btn" onClick={onClose}>취소</button>
              </td>
              <td className="submit-cell">
                <button 
                  className="submit-btn" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '등록 중...' : '등록'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductQnAWrite;