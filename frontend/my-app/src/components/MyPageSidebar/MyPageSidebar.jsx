import React from "react";
import "./MyPageSidebar.css";

function MyPageSidebar() {
  return (
    <aside className="my-page-sidebar">
      <h2 className="sidebar-title">MY PAGE</h2>
      <ul className="sidebar-section">
        <li className="section-title">주문관리</li>
        <li className="section-item">주문·배송 내역</li>
        <li className="section-item">취소·반품·교환 내역</li>
        <li className="section-item">계단운반비 조회</li>
      </ul>

      <ul className="sidebar-section">
        <li className="section-title">상담 관리</li>
        <li className="section-item">인테리어 상담 내역</li>
        <li className="section-item">매장 상담 예약 내역</li>
        <li className="section-item">MY 견적서</li>
      </ul>

      <ul className="sidebar-section">
        <li className="section-title">나의 혜택</li>
        <li className="section-item">포인트</li>
        <li className="section-item">쿠폰</li>
        <li className="section-item">쿠폰선물</li>
      </ul>

      <ul className="sidebar-section">
        <li className="section-title">나의 활동</li>
        <li className="section-item">찜</li>
        <li className="section-item">최근 본 상품</li>
        <li className="section-item">리뷰 작성</li>
        <li className="section-item">상품 문의</li>
        <li className="section-item">재입고 알림 신청 내역</li>
      </ul>

      <ul className="sidebar-section">
        <li className="section-title">나의 정보</li>
        <li className="section-item">회원 정보 변경</li>
        <li className="section-item">배송지 관리</li>
      </ul>

      <ul className="sidebar-section">
        <li className="section-title">고객서비스</li>
        <li className="section-item">1:1 문의내역</li>
        <li className="section-item">FAQ</li>
        <li className="section-item">공지사항</li>
        <li className="section-item">고객센터</li>
        <li className="section-item">재입고 알림 신청 내역</li>
      </ul>
    </aside>
  );
}

export default MyPageSidebar;
