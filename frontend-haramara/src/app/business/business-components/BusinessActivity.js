'use client';

import React from 'react';
import styles from './BusinessActivity.module.css';

const BusinessActivity = ({
  image,
  title,
  rating = 0,
  onEdit
}) => {
  // Función para renderizar estrellas basado en la calificación
  const renderStars = (rating) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    const stars = [];
    
    // Agregar estrellas llenas
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className={styles.starFull}>★</span>
      );
    }
    
    // Agregar media estrella si es necesario
    if (halfStar) {
      stars.push(
        <span key="half" className={styles.starHalf}>★</span>
      );
    }
    
    // Agregar estrellas vacías
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className={styles.starEmpty}>☆</span>
      );
    }
    
    return stars;
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={image} 
          alt={title} 
          className={styles.image} 
        />
      </div>
      
      <div className={styles.contentContainer}>
        <h3 className={styles.title}>{title}</h3>
        
        <div className={styles.ratingContainer}>
          {renderStars(rating)}
        </div>
        
        <button 
          className={styles.editButton}
          onClick={() => onEdit()}
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default BusinessActivity;