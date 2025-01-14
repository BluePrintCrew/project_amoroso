import React from 'react';
import './MagazineSection.css';

function MagazineSection() {
  return (
    <section className="magazine-section">
      <h3>Magazine</h3>
      <div className="magazine-grid">
        <div className="magazine-card">
          <h4>Amoroso는 어떻게 다를까요?</h4>
          <p>관심을 디자인으로 녹여낸 장인정신</p>
        </div>
        <div className="magazine-card">
          <h4>가구 제작 과정</h4>
          <p>숙련된 전문가들의 핸드메이드 공정</p>
        </div>
      </div>
    </section>
  );
}

export default MagazineSection;
