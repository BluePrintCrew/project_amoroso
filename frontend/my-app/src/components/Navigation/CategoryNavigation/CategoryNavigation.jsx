import React, { useState, useEffect, useRef } from 'react';
import styles from './CategoryNavigation.module.css';

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// categoryMap: { [대분류]: [{ label, value }] }
const CategoryNavigation = ({ categoryMap }) => {
  const mainCategories = Object.keys(categoryMap);
  const [selectedMain, setSelectedMain] = useState(mainCategories[0]);
  const [selectedSub, setSelectedSub] = useState(categoryMap[mainCategories[0]][0]?.value);
  const [showNav, setShowNav] = useState(true);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const observerRef = useRef(null);

  // IntersectionObserver로 스크롤 시 하이라이트 변경 (debounce 적용)
  useEffect(() => {
    const subValues = mainCategories.flatMap(main => categoryMap[main].map(sub => sub.value));
    const handleIntersect = debounce((entries) => {
      let found = false;
      entries.forEach(entry => {
        if (entry.isIntersecting && !found) {
          const subValue = entry.target.id.replace('category-', '');
          for (const main of mainCategories) {
            if (categoryMap[main].some(sub => sub.value === subValue)) {
              setSelectedMain(main);
              setSelectedSub(subValue);
              found = true;
              break;
            }
          }
        }
      });
    }, 300);
    observerRef.current = new window.IntersectionObserver(handleIntersect, { threshold: 0.3 });
    subValues.forEach(subValue => {
      const el = document.getElementById(`category-${subValue}`);
      if (el) observerRef.current.observe(el);
    });
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [categoryMap, mainCategories]);

  const handleMainClick = (main) => {
    setSelectedMain(main);
    setSelectedSub(categoryMap[main][0]?.value);
    const el = document.getElementById(`category-${categoryMap[main][0]?.value}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubClick = (subValue) => {
    setSelectedSub(subValue);
    const el = document.getElementById(`category-${subValue}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClose = () => {
    setShowNav(false);
    setShowFloatingBtn(true);
  };

  const handleOpen = () => {
    setShowNav(true);
    setShowFloatingBtn(false);
  };

  return (
    <>
      {showNav && (
        <aside className={styles.categoryNav2depth}>
          <button className={styles.closeBtn} onClick={handleClose}>×</button>
          <div className={styles.mainCategories}>
            {mainCategories.map(main => (
              <button
                key={main}
                className={`${styles.categoryButton} ${selectedMain === main ? styles.active : ''}`}
                onClick={() => handleMainClick(main)}
              >
                {main}
              </button>
            ))}
          </div>
          <div className={styles.subCategories}>
            {categoryMap[selectedMain].map(sub => (
              <button
                key={sub.value}
                className={`${styles.categoryButton} ${selectedSub === sub.value ? styles.active : ''}`}
                onClick={() => handleSubClick(sub.value)}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </aside>
      )}
      {showFloatingBtn && (
        <button className={styles.floatingBtn} onClick={handleOpen} title="카테고리 열기">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="11" width="16" height="2.5" rx="1.2" fill="#fff"/>
            <rect x="8" y="15" width="16" height="2.5" rx="1.2" fill="#fff"/>
            <rect x="8" y="19" width="16" height="2.5" rx="1.2" fill="#fff"/>
          </svg>
        </button>
      )}
    </>
  );
};

export default CategoryNavigation;
