// src/pages/MyPage/MyPageProfileCard.jsx

import React from "react";
import "./MyPageProfileCard.css";

function MyPageProfileCard() {
  // Dummy data for now
  const userInfo = {
    name: "홍길동님",
    greeting: "안녕하세요!",
    points: 9118,
    coupons: 4,
    reviewCount: 11,
    wishlistCount: 3
  };

  return (
    <div className="my-page-profile-card">
      <div className="profile-user-info">
        <h2>
          {userInfo.name} &gt;
        </h2>
        <p>{userInfo.greeting}</p>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <span className="icon">P</span>
          <p>보유 포인트</p>
          <strong>
            {userInfo.points.toLocaleString()} P
          </strong>
        </div>
        <div className="profile-stat">
          <span className="icon">🎟</span>
          <p>사용 가능 쿠폰</p>
          <strong>{userInfo.coupons}</strong>
        </div>
        <div className="profile-stat">
          <span className="icon">💬</span>
          <p>작성 가능 후기</p>
          <strong>{userInfo.reviewCount}</strong>
        </div>
        <div className="profile-stat">
          <span className="icon">❤️</span>
          <p>찜</p>
          <strong>{userInfo.wishlistCount}</strong>
        </div>
      </div>
    </div>
  );
}

export default MyPageProfileCard;
