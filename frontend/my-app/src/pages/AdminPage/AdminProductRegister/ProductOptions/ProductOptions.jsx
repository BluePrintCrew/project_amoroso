import React from "react";
import styles from "./ProductOptions.module.css";

function ProductOptions({ options, setOptions }) {
  // Example: options is an array of { optionName, optionValue }
  const addOption = () => {
    setOptions([...options, { optionName: "", optionValue: "" }]);
  };

  const updateOption = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  return (
    <section className={styles.optionsSection}>
      <h3 className={styles.sectionTitle}>옵션 정보</h3>
      {options.map((opt, index) => (
        <div key={index} className={styles.formRow}>
          <label>옵션명</label>
          <input
            type="text"
            value={opt.optionName}
            onChange={(e) => updateOption(index, "optionName", e.target.value)}
          />

          <label>옵션값</label>
          <input
            type="text"
            value={opt.optionValue}
            onChange={(e) => updateOption(index, "optionValue", e.target.value)}
          />
        </div>
      ))}

      <button type="button" onClick={addOption}>
        옵션 추가
      </button>
    </section>
  );
}

export default ProductOptions;
