import React, { useState, useEffect } from "react";
import "./MyPageProfileCard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Import your images
import pointIcon from "../../assets/point_img.png";
import couponIcon from "../../assets/coupon_img.png";
import reviewIcon from "../../assets/review_img.png";
import zzimIcon from "../../assets/zzim_img.png";
import editIcon from "../../assets/svg/edit.svg"; // 연필 아이콘 추가 필요

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function MyPageProfileCard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    greeting: "안녕하세요!",
    points: 0,
    coupons: 0,
    reviewCount: 0,
    wishlistCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          // 토큰이 없으면 오류 처리
          setError("로그인이 필요합니다");
          setLoading(false);
          return;
        }
        // API 호출
        const response = await axios.get(`${API_BASE_URL}/api/v1/auth/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("프로필 API 응답:", response.data);
        // API 응답 데이터를 사용자 정보 객체로 매핑
        setUserInfo({
          name: response.data.name ? `${response.data.name}님` : "고객님",
          greeting: "안녕하세요!",
          points: response.data.points || 0, // API에서 제공하는 포인트 정보
          coupons: response.data.availableCoupons || 0,
          reviewCount: response.data.pendingReviews || 0,
          wishlistCount: response.data.wishlistCount || 0
        });
      } catch (error) {
        console.error("프로필 정보 로딩 오류:", error);
        setError("프로필 정보를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 내 정보 관리 페이지로 이동하는 함수
  const handleEditProfile = () => {
    navigate('/mypageinfo');
  };

  // 로딩 중일 때 표시할 내용
  if (loading) {
    return (
      <div className="my-page-profile-wrapper loading">
        <p>사용자 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 오류가 있을 때 표시할 내용
  if (error) {
    return (
      <div className="my-page-profile-wrapper error">
        <p>{error}</p>
        <button onClick={() => window.location.href = '/login'}>로그인하기</button>
      </div>
    );
  }

  return (
    <div className="my-page-profile-wrapper">
      {/* Left side: name + greeting */}
      <div className="profile-left">
        <div className="name-edit-container">
          <h2 className="user-name">
            {userInfo.name} <span className="arrow">&gt;</span>
          </h2>
          <button className="edit-profile-button" onClick={handleEditProfile}>
            <img src={editIcon} alt="수정" className="edit-icon" />
            <span>내 정보 관리</span>
          </button>
        </div>
        <p className="greeting">{userInfo.greeting}</p>
      </div>
      
      {/* Right side: 4 stats in a row */}
      <div className="profile-right">
        <div className="stat-box">
          {/* Icon for points */}
          <img src={pointIcon} alt="포인트 아이콘" className="stat-icon" />
          <p className="stat-title">보유 포인트</p>
          <p className="stat-value">{userInfo.points.toLocaleString()} P</p>
        </div>
        <div className="stat-box">
          {/* Icon for coupons */}
          <img src={couponIcon} alt="쿠폰 아이콘" className="stat-icon" />
          <p className="stat-title">사용 가능 쿠폰</p>
          <p className="stat-value">{userInfo.coupons}</p>
        </div>
        <div className="stat-box">
          {/* Icon for reviews */}
          <img src={reviewIcon} alt="후기 아이콘" className="stat-icon" />
          <p className="stat-title">작성 가능 후기</p>
          <p className="stat-value">{userInfo.reviewCount}</p>
        </div>
        <div className="stat-box">
          {/* Icon for wishlist */}
          <img src={zzimIcon} alt="찜 아이콘" className="stat-icon" />
          <p className="stat-title">찜</p>
          <p className="stat-value">{userInfo.wishlistCount}</p>
        </div>
      </div>
    </div>
  );
}

export default MyPageProfileCard;