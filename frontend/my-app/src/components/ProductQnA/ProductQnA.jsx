import React, { useState, useEffect } from 'react';
import './ProductQnA.css';
import { useNavigate } from 'react-router-dom';
import lockIcon from '../../assets/lock-icon.svg';  // 자물쇠 아이콘 (비밀글 표시용)
import ProductQnAWrite from './ProductQnAWrite';  // QnA 작성 모달 컴포넌트 추가

const ProductQnA = () => {
  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [viewOption, setViewOption] = useState('all');
  const [showWriteModal, setShowWriteModal] = useState(false);  // 작성 모달 표시 상태
  
  const navigate = useNavigate();

  // 가상 데이터 (실제 구현 시 API로 대체)
  useEffect(() => {
    // 임시 데이터 설정 함수
    const setupMockData = () => {
      // 임시 데이터
      const mockData = [
        { 
          id: 1, 
          status: '답변완료', 
          title: '비밀글입니다.', 
          isSecret: true, 
          author: 'kais******', 
          date: '2025.03.30',
          isNew: true 
        },
        { 
          id: 2, 
          status: '미답변', 
          title: '수요일에 구매했는데 이번주중에 받을 수 있나요?', 
          isSecret: false, 
          author: 'rlae****', 
          date: '2025.03.28',
          isNew: true 
        },
        { 
          id: 3, 
          status: '답변완료', 
          title: '비밀글입니다.', 
          isSecret: true, 
          author: 'lson***', 
          date: '2025.03.25',
          isNew: false 
        },
        { 
          id: 4, 
          status: '답변완료', 
          title: '비밀글입니다.', 
          isSecret: true, 
          author: 'lson***', 
          date: '2025.03.25',
          isNew: false 
        },
        { 
          id: 5, 
          status: '답변완료', 
          title: '비밀글입니다.', 
          isSecret: true, 
          author: 'kyup***', 
          date: '2025.03.24',
          isNew: false 
        },
        { 
          id: 6, 
          status: '미답변', 
          title: '오늘 구매했는데 언제쯤 배송 되나요? 그리고 중국내수용???인가요 아니겠지요?', 
          isSecret: false, 
          author: 'ss84****', 
          date: '2025.03.24',
          isNew: false 
        },
      ];
      
      setTimeout(() => {
        setQnaList(mockData);
        setLoading(false);
      }, 500); // 로딩 효과를 위한 지연
    };
    
    // 로그인 상태 확인
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    
    setupMockData();
  }, []);

  // QnA 작성 모달 열기
  const handleWriteQnA = () => {
    if (!isLoggedIn) {
      if (window.confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login', { state: { from: window.location.pathname } });
      }
      return;
    }
    
    // 모달 열기
    setShowWriteModal(true);
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
    
    // 내 상품문의 목록 페이지로 이동 (임시로 #으로 처리)
    navigate('/mypage/inquiries');
  };
  
  const handleQnAClick = (qna) => {
    // 비밀글인 경우, 작성자 또는 관리자만 볼 수 있도록 처리
    if (qna.isSecret) {
      alert('비밀글은 작성자와 관리자만 확인할 수 있습니다.');
      return;
    }
    
    // 상품문의 상세 페이지로 이동 (임시로 알림만 표시)
    alert(`상품 문의 ID: ${qna.id}의 상세 내용을 보여줍니다.`);
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
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
              checked={viewOption === 'my'}
              onChange={() => setViewOption(viewOption === 'my' ? 'all' : 'my')}
            />
            <span className="checkmark"></span>
            비밀글 제외
          </label>
          
          <label className="checkbox-container my-qna">
            <input
              type="checkbox"
              checked={viewOption === 'answered'}
              onChange={() => setViewOption(viewOption === 'answered' ? 'all' : 'answered')}
              disabled={!isLoggedIn}
            />
            <span className="checkmark"></span>
            내 Q&A 보기
          </label>
        </div>
        
        <div className="sort-options">
          <select value={sortOption} onChange={handleSortChange} className="sort-select">
            <option value="newest">답변상태</option>
            <option value="oldest">등록일 오래된순</option>
            <option value="popular">등록일 최신순</option>
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
      <div className="pagination">
        <button className="page-button">&lt;</button>
        <button className="page-button active">1</button>
        <button className="page-button">2</button>
        <button className="page-button">3</button>
        <button className="page-button">4</button>
        <button className="page-button">5</button>
        <button className="page-button">&gt;</button>
      </div>
      
      {/* QnA 작성 모달 */}
      {showWriteModal && (
        <ProductQnAWrite 
          onClose={handleCloseModal} 
          product={{ id: 123, name: '상품명' }} 
        />
      )}
    </div>
  );
};

export default ProductQnA;