import React from "react";
import "./AdminCard.css";

function AdminCard({
  icon,
  title,
  value,
  unit,
  comparisonLabel,
  comparisonValue,
  comparisonPositive,
  dropdownOptions,
  dropdownValue,
  onDropdownChange,
  style,
}) {
  return (
    <div className="admin-card" style={style}>
      <div className="admin-card-header">
        {icon && <span className="admin-card-icon">{icon}</span>}
        {dropdownOptions && (
          <select
            className="admin-card-dropdown"
            value={dropdownValue}
            onChange={onDropdownChange}
          >
            {dropdownOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>
      <div className="admin-card-title">{title}</div>
      <div className="admin-card-value">
        <span className="value">{value}</span>
        {unit && <span className="unit">{unit}</span>}
      </div>
      {(comparisonLabel || comparisonValue) && (
        <div className="admin-card-comparison">
          {comparisonValue && (
            <span className={comparisonPositive ? "positive" : "negative"}>
              {comparisonValue}
            </span>
          )}
          {comparisonLabel && <span className="comparison-label">{comparisonLabel}</span>}
        </div>
      )}
    </div>
  );
}

export default AdminCard;
