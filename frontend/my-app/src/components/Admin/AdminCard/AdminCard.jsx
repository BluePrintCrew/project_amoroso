import React from "react";
import "./AdminCard.css";

function AdminCard({ title, children, style }) {
  return (
    <div className="admin-card" style={style}>
      <div className="card-content">
        {children}
      </div>
      {title && <h3 className="card-title">{title}</h3>}
    </div>
  );
}

export default AdminCard;
