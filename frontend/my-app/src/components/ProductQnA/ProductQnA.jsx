import React, { useState, useEffect } from 'react';
import './ProductQnA.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import lockIcon from '../../assets/lock-icon.svg';
import ProductQnAWrite from './ProductQnAWrite';
import ProductQnADetail from './ProductQnADetail';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const ProductQnA = () => {
  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [viewOption, setViewOption] = useState('all');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [product, setProduct] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null); 
  const navigate = useNavigate();

// 수정해야 할 코드
const { id } = useParams(); // 라우트 파라미터명과 일치하도록 변경
const productId = id; // productId 변수를 계속 사용하려면 이렇게 할당

  // API에서 상품 Q&A 데이터 가져오기
// 응답 데이터 변환 부분 수정
useEffect(() => {
  const fetchQnAs = async () => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    
    try {
      console.log("API 요청 정보:", {
        url: `${API_BASE_URL}/api/v1/inquiries/product/${productId}`,
        params: { page: currentPage, size: 5 }
      });

      const response = await axios.get(`${API_BASE_URL}/api/v1/inquiries/product/${productId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        params: {
          page: currentPage,
          size: 5
        }
      });
      
      console.log("상품 Q&A 응답:", response.data);
      
      // 상품 정보 설정
      setProduct({ id: productId, name: '상품명' });
      
      // 페이지 정보 설정 - 응답 형식에 맞게 설정
      setTotalPages(response.data.totalPages || 0);
      
      // 응답 데이터 변환 - 응답 형식에 맞게 필드명 매핑
      const formattedQnAs = response.data.content && response.data.content.length > 0
        ? response.data.content.map(item => ({
            id: item.inquiryId,
            status: item.answered ? '답변완료' : '미답변',
            title: item.inquiryTitle,
            content: item.inquiryDescription,
            isSecret: false, // API에서 비밀글 여부가 제공되지 않으므로 기본값 사용
            author: item.authorUsername,
            date: formatDate(item.createdAt),
            isNew: isNewItem(item.createdAt)
          }))
        : [];
      
      setQnaList(formattedQnAs);
      setLoading(false);
    } catch (err) {
      console.error("Q&A 로딩 오류:", err);
      console.error("오류 상세:", err.response?.data || err.message);
      setQnaList([]);
      setLoading(false);
    }
  };
  
  fetchQnAs();
}, [productId, currentPage, sortOption, viewOption]); 
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    } catch (e) {
      console.error("날짜 포맷팅 오류:", e);
      return dateString;
    }
  };
  
  // 새 항목인지 확인 (3일 이내 등록된 항목)
  const isNewItem = (dateString) => {
    if (!dateString) return false;
    
    try {
      const itemDate = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - itemDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays <= 3;
    } catch (e) {
      return false;
    }
  };

  // QnA 작성 모달 열기
  const handleWriteQnA = () => {
    if (!isLoggedIn) {
      if (window.confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
      return;
    }
    
    setShowWriteModal(true);
  };
  
  
  // QnA 작성 완료 후 목록 갱신
  const handleQnASubmitSuccess = () => {
    setShowWriteModal(false);
    // 첫 페이지로 이동하고 목록 갱신
    setCurrentPage(0);
    setLoading(true);
    // useEffect에 의해 목록 다시 로드됨
  };
  
  // QnA 작성 모달 닫기
  const handleCloseModal = () => {
    setShowWriteModal(false);
  };
  
  const handleViewMyQnA = () => {
    if (!isLoggedIn) {
      if (window.confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
      return;
    }
    
    navigate('/mypage/inquiries');
  };
  
  const handleQnAClick = (qna) => {
    // 비밀글인 경우 처리 (백엔드에서도 이에 대한 처리 필요)
    if (qna.isSecret) {
      alert('비밀글은 작성자와 관리자만 확인할 수 있습니다.');
      return;
    }
    
    // 상세 모달 표시
    setSelectedInquiry(qna);
    setShowDetailModal(true);
  };
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedInquiry(null);
  };
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  // 페이지 변경 처리
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 페이지 번호 생성
  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages));
    
    if (startPage < 0) startPage = 0;
    
    for (let i = startPage; i < startPage + maxVisiblePages && i < totalPages; i++) {
      pageButtons.push(
        <button 
          key={i} 
          className={`page-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </button>
      );
    }
    
    return pageButtons;
  };

  return (
    <div className="product-qna-container">
      {/* 상품문의 헤더 */}
      <div className="qna-header">
        <h2 className="qna-title">Q&A</h2>
        <p className="qna-description">구매하시려는 상품에 대해 궁금한 점이 있으신 경우 문의해주세요.</p>
      </div>
      
      {/* 상품문의 작성 버튼과 내 문의보기 버튼 */}
      <div className="qna-action-buttons">
        <button className="write-qna-button" onClick={handleWriteQnA}>
          상품 Q&A 작성하기
        </button>
        <button className="view-my-qna-button" onClick={handleViewMyQnA}>
          내 Q&A 보기 <span className="arrow">{'>'}</span>
        </button>
      </div>
      
      {/* 보기 옵션과 정렬 옵션 */}
      <div className="qna-options">
        <div className="view-options">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={viewOption === 'public'}
              onChange={() => setViewOption(viewOption === 'public' ? 'all' : 'public')}
            />
            <span className="checkmark"></span>
            비밀글 제외
          </label>
          
          <label className="checkbox-container my-qna">
            <input
              type="checkbox"
              checked={viewOption === 'my'}
              onChange={() => setViewOption(viewOption === 'my' ? 'all' : 'my')}
              disabled={!isLoggedIn}
            />
            <span className="checkmark"></span>
            내 Q&A 보기
          </label>
        </div>
        
        <div className="sort-options">
          <select value={sortOption} onChange={handleSortChange} className="sort-select">
            <option value="newest">최신순</option>
            <option value="oldest">등록일 오래된순</option>
            <option value="status">답변상태</option>
          </select>
        </div>
      </div>
      
      {/* QnA 목록 */}
      {loading ? (
        <div className="loading-container">
          <p>상품문의를 불러오는 중입니다...</p>
        </div>
      ) : (
        <div className="qna-list-container">
          <table className="qna-table">
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '50%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>답변상태</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {qnaList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">
                    상품 문의가 없습니다.
                  </td>
                </tr>
              ) : (
                qnaList.map((qna) => (
                  <tr key={qna.id} onClick={() => handleQnAClick(qna)} className="qna-item">
                    <td className={`qna-status ${qna.status === '답변완료' ? 'completed' : 'pending'}`}>
                      {qna.status}
                    </td>
                    <td className="qna-title-cell">
                      {qna.isSecret && (
                        <img src={lockIcon} alt="비밀글" className="lock-icon" />
                      )}
                      <span className="qna-item-title">
                        {qna.title}
                      </span>
                      {qna.isNew && <span className="new-badge">NEW</span>}
                    </td>
                    <td className="qna-author">{qna.author}</td>
                    <td className="qna-date">{qna.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <div className="pagination">
          <button 
            className="page-button" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            &lt;
          </button>
          
          {renderPageNumbers()}
          
          <button 
            className="page-button" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            &gt;
          </button>
        </div>
      )}
      
      {/* QnA 작성 모달 */}
      {showWriteModal && (
        <ProductQnAWrite 
          onClose={handleCloseModal} 
          product={product}
          onSubmitSuccess={handleQnASubmitSuccess}
        />
        
      )}
      {/* QnA 상세 모달 */}
{showDetailModal && selectedInquiry && (
  <ProductQnADetail 
    onClose={handleCloseDetailModal} 
    inquiry={selectedInquiry}
  />
)}
    </div>
  );
};

export default ProductQnA;