import React from "react";
import "./MyPageProfileCard.css";

// Import your images
import pointIcon from "../../assets/point_img.png";
import couponIcon from "../../assets/coupon_img.png";
import reviewIcon from "../../assets/review_img.png";
import zzimIcon from "../../assets/zzim_img.png";

function MyPageProfileCard() {
  const userInfo = {
    name: "홍길동님",
    greeting: "안녕하세요!",
    points: 9118,
    coupons: 4,
    reviewCount: 11,
    wishlistCount: 3
  };

  return (
    <div className="my-page-profile-wrapper">
      {/* Left side: name + greeting */}
      <div className="profile-left">
        <h2 className="user-name">
          {userInfo.name} <span className="arrow">&gt;</span>
        </h2>
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
