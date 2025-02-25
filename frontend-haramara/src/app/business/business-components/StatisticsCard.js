import React from 'react';
import styles from './StatisticsCard.module.css';

const StatisticsCard = ({ 
  title = 'Estadística',
  value = '0',
  percentage = 0,
  icon,
  iconBgColor = '#e6f7ff'
}) => {
  const isPositive = percentage >= 0;
  const formattedPercentage = `${isPositive ? '+' : ''}${percentage}%`;
  const percentageClass = isPositive ? styles.positive : styles.negative;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.stats}>
          <div className={styles.value}>{value}</div>
          <div className={`${styles.percentage} ${percentageClass}`}>
            {formattedPercentage}
          </div>
        </div>
      </div>
      <div 
        className={styles.iconContainer} 
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatisticsCard;