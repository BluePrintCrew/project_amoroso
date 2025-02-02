import React from 'react';
import './BenefitsSection.css';

function BenefitsSection() {
  return (
    <section className="benefits-section">
      <div className="benefit-card">
        <h4>사랑하는 가족을 위한 리빙 룸</h4>
        <p>모던한 가죽&패브릭 소파 컬러 가이드</p>
      </div>
      <div className="benefit-card">
        <h4>더 정통한 다이닝&소파</h4>
        <p>이탈리아 가구 기획전</p>
      </div>
    </section>
  );
}

export default BenefitsSection;
