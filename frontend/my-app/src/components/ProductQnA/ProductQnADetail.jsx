import React from 'react';
import './ProductQnADetail.css';

const ProductQnADetail = ({ onClose, inquiry }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="modal-header">
          <h2>상품 Q&A 상세보기</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {/* 본문 */}
        <div className="modal-body">
          {/* 제목 및 작성자 정보 */}
          <div className="inquiry-title-row">
            <h3 className="inquiry-title">{inquiry.title}</h3>
            <span className={`inquiry-status-badge ${inquiry.status === '답변완료' ? 'completed' : 'pending'}`}>
              {inquiry.status}
            </span>
          </div>
          
          <div className="inquiry-author-info">
            <span className="inquiry-author">{inquiry.author}</span>
            <span className="inquiry-date">{inquiry.date}</span>
          </div>
          
          {/* 구분선 */}
          <div className="inquiry-divider"></div>
          
          {/* 문의 내용 */}
          <div className="inquiry-content-section">
            <h4 className="section-label">문의 내용</h4>
            <div className="inquiry-content-box">
              <p className="inquiry-content">{inquiry.content}</p>
            </div>
          </div>
          
          {/* 답변 영역 - 답변이 있는 경우에만 표시 */}
          {inquiry.status === '답변완료' && (
            <div className="inquiry-answer-section">
              <h4 className="section-label">답변</h4>
              <div className="answer-box">
                <div className="answer-header">
                  <span className="answer-author">판매자</span>
                  <span className="answer-date">{inquiry.answerDate || inquiry.date}</span>
                </div>
                <p className="answer-content">
                  {inquiry.answer || "답변이 곧 등록될 예정입니다."}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* 버튼 */}
        <div className="modal-footer">
          <button className="confirm-btn" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default ProductQnADetail;