import React from 'react';
import styles from './ErrorPopup.module.css';

const ErrorPopup = ({ message, onClose }) => (
  <div className={styles.overlay} role="dialog" aria-modal="true">
    <div className={styles.popup}>
      <div className={styles.icon}>❗️</div>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeBtn} onClick={onClose} autoFocus>닫기</button>
    </div>
  </div>
);

export default ErrorPopup; 