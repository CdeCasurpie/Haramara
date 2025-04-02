'use client';

import React, { act } from 'react';
import styles from './BusinessActivity.module.css';

const BusinessActivity = ({
  activity,
  onEdit,
  isEditing = false
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
          src={"/images/general/placeholder_image.png"} 
          alt={activity.title}
          className={styles.image} 
        />
      </div>
      
      <div className={styles.contentContainer}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{activity.title}</h3>
          <div className={styles.ratingContainer}>
            {renderStars(activity.rating ? activity.rating : 0)}
          </div>
        </div>
        
        <div className={styles.detailsContainer}>
          <div className={styles.infoGrid}>
            {activity.min_age > 0 && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Desde los </span>
                <span className={styles.infoValue}>{activity.min_age} años</span>
              </div>
            )}
            
            {activity.location && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ubicación:</span>
                <span className={styles.infoValue}>{activity.location.address ? activity.location.address : "Sin ubicación"}</span>
              </div>
            )}
          </div>
        </div>
        
        <button 
          className={isEditing ? styles.editingButton : styles.editButton}
          onClick={() => onEdit(activity)}
        >
          {isEditing ? 'Editando' : 'Editar'}
        </button>
      </div>
    </div>
  );
};

export default BusinessActivity;