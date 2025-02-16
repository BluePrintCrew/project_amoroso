import React from "react";
import "./ProductInquiry.css";

function ProductInquiry() {
  // Dummy data for "상품 문의"
  const productInquiries = [
    {
      status: "답변대기",
      content: "상품문의 내용이 들어갑니다.상품문의 내용이 들어갑니다...",
      date: "2024.12.19"
    },
    {
      status: "답변완료",
      content: "상품문의 내용이 들어갑니다.",
      date: "2024.12.19"
    },
    {
      status: "답변대기",
      content: "상품문의 내용이 들어갑니다.",
      date: "2024.12.19"
    },
    {
      status: "답변대기",
      content: "상품문의 내용이 들어갑니다.",
      date: "2024.12.19"
    }
  ];

  // Dummy data for "1:1 문의"
  const oneToOneInquiries = [
    {
      status: "답변대기",
      content: "1:1 문의 내용이 들어갑니다.1:1 문의 내용이 들어갑니다..",
      date: "2024.12.19"
    },
    {
      status: "답변완료",
      content: "1:1 문의 내용이 들어갑니다.",
      date: "2024.12.19"
    },
    {
      status: "답변대기",
      content: "1:1 문의 내용이 들어갑니다.",
      date: "2024.12.19"
    },
    {
      status: "답변대기",
      content: "1:1 문의 내용이 들어갑니다.",
      date: "2024.12.19"
    }
  ];

  return (
    <div className="product-inquiry-container">
      <div className="inquiry-columns">
        {/* Left Column: 상품 문의 */}
        <div className="inquiry-column">
          <h2 className="inquiry-title">
            상품 문의 &gt;
          </h2>
          <ul className="inquiry-list">
            {productInquiries.map((item, index) => (
              <li key={index} className="inquiry-item">
                {/* Status badge */}
                <span
                  className={
                    item.status === "답변완료" ? "badge complete" : "badge pending"
                  }
                >
                  {item.status}
                </span>
                {/* Inquiry content */}
                <span className="inquiry-content">
                  {item.content}
                </span>
                {/* Date */}
                <span className="inquiry-date">
                  {item.date}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: 1:1 문의 */}
        <div className="inquiry-column">
          <h2 className="inquiry-title">
            1:1 문의 &gt;
          </h2>
          <ul className="inquiry-list">
            {oneToOneInquiries.map((item, index) => (
              <li key={index} className="inquiry-item">
                <span
                  className={
                    item.status === "답변완료" ? "badge complete" : "badge pending"
                  }
                >
                  {item.status}
                </span>
                <span className="inquiry-content">
                  {item.content}
                </span>
                <span className="inquiry-date">
                  {item.date}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Note + 카톡상담하기 button */}
      <div className="inquiry-footer">
        <p className="inquiry-note">
          • 주문, AS 및 반품관련 문의는 간편하게 카톡상담을 이용해 주세요.
        </p>
        <button className="kakao-button">
          <span className="kakao-icon">💬</span> 카톡상담하기
        </button>
      </div>
    </div>
  );
}

export default ProductInquiry;
