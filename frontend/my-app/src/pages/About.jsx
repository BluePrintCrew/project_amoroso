import React from "react";
import mainCover from "../assets/mainpage/cover1.jpg";
import { ReactComponent as LogoSvg } from "../assets/svg/logo.svg";

const About = () => (
  <div style={{ maxWidth: 900, margin: "40px auto", padding: 24, fontFamily: "Pretendard, sans-serif" }}>
    <img
      src={mainCover}
      alt="프리미엄 가구 메인"
      style={{
        width: "100%",
        maxHeight: 340,
        objectFit: "cover",
        borderRadius: 16,
        marginBottom: 32,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
      }}
    />
    <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
      <LogoSvg style={{ width: 120, height: 40, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} />
      <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700 }}>회사소개</h1>
    </div>
    <p style={{ fontSize: "1.13rem", lineHeight: 1.8, color: "#222" }}>
      <b>2024년 아주대학교 창업동아리 BluePrint</b>에서 시작한 프로젝트입니다.<br /><br />
      저희는 <b>베스티아가구 주식회사</b>와 MOU를 맺고, 프리미엄 이태리 가구를 비롯한 고급 가구의 판매 플랫폼을 만들고 있습니다.<br /><br />
      앞으로의 로드맵은 <b>가구 리폼</b>을 소프트웨어적으로 혁신하는 방향으로 확장할 계획입니다.<br /><br />
      더 나은 공간, 더 나은 삶을 위한 가구 플랫폼을 지향합니다.
    </p>
  </div>
);

export default About; 