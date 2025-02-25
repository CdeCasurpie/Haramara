import React from 'react';
import { Star, StarFill, StarHalf } from 'react-bootstrap-icons';

const StarsRating = ({ rating, size, starSpacing=0 }) => {
  // Redondea el rating al múltiplo de 0.5 más cercano
  const roundedRating = Math.round(rating * 2) / 2;

  // Calcula la cantidad de estrellas completas, media y vacías
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating - fullStars === 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: starSpacing }}>
      {Array.from({ length: fullStars }, (_, i) => (
        <StarFill key={`full-${i}`} size={size} style={{ color: '#D8AD00' }} />
      ))}
      {halfStar === 1 && (
        <StarHalf key="half" size={size} style={{ color: '#D8AD00' }} />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star key={`empty-${i}`} size={size} style={{ color: '#D8AD00' }} />
      ))}
    </div>
  );
};

export default StarsRating;
