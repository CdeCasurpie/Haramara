import React from 'react';
import styles from './HaramaraButton.module.css';

const HaramaraButton = ({ children, variant = 'primary', onClick, className = '' }) => {
  return (
    <button
      className={`${className} ${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default HaramaraButton;