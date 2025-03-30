import React, { useState } from 'react';
import './ProductQnAWrite.css';

const ProductQnAWrite = ({ onClose, product }) => {
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charCount = content.length;
  const maxChars = 1000;

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('문의 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 테스트용 지연 효과
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('상품 문의가 등록되었습니다.');
      onClose();
    } catch (error) {
      console.error('문의 등록 오류:', error);
      alert('문의 등록에 실패했습니다. 다시 시도해주세요.');
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