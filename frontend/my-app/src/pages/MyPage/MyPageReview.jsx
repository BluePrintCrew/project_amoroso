import React from "react";
import "./MyPageReview.css";

function MyPageReview() {
  // Dummy data for now (replace with real data when connected to a backend)
  const reviews = [
    {
      productName: "상품명이 들어갑니다.상품명이 들어갑니다.상품명이 들어갑니다.상품명이 들어갑니다.",
      purchaseDate: "2024.12.19 12:34",
      hasReview: false // whether the user already wrote a review
    },
    {
      productName: "상품명이 들어갑니다.상품명이 들어갑니다.상품명이 들어갑니다.상품명이 들어갑니다....",
      purchaseDate: "2024.12.19 12:34",
      hasReview: true
    },
    {
      productName: "상품명이 들어갑니다.상품명이 들어갑니다.",
      purchaseDate: "2024.12.19 12:34",
      hasReview: false
    }
  ];

  return (
    <div className="my-page-review-container">
      <h2 className="review-title">
        작성 가능한 후기 &gt;
      </h2>

      <table className="review-table">
        <thead>
          <tr>
            <th>상품명</th>
            <th>구매/상담일</th>
            <th>후기 작성</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((item, idx) => (
            <tr key={idx}>
              <td>
                {item.productName}
              </td>
              <td>
                {item.purchaseDate}
              </td>
              <td>
                {item.hasReview ? (
                  <button className="review-btn disabled">
                    작성한 후기 보기
                  </button>
                ) : (
                  <button className="review-btn">
                    후기 작성하기
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyPageReview;
