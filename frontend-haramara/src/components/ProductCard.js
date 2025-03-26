import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HaramaraButton from './HaramaraButton';
import styles from './ProductCard.module.css';

const ProductCard = ({ 
  id, 
  imageUrl, 
  title, 
  price, 
  discountPrice, 
  ratings = 4.5, 
  reviewCount = 124,
  inventory = 10,
  href = "#"
}) => {
  const [inCart, setInCart] = useState(false);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInCart(!inCart);
    // Aquí iría la lógica para añadir al carrito
  };

  // Calcular el porcentaje de descuento si hay precio con descuento
  const discountPercentage = discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : null;

  // Generar estrellas basado en ratings
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(ratings);
    const hasHalfStar = ratings % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className={styles.star}>★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className={styles.star}>★</span>);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className={styles.emptyStar}>☆</span>);
    }
    
    return stars;
  };

  return (
    <Link href={href} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          {imageUrl && (
            <Image 
              src={imageUrl} 
              alt={title}
              width={500}
              height={400}
              className={styles.image}
              priority
            />
          )}
          {discountPercentage && (
            <div className={styles.discountBadge}>
              -{discountPercentage}%
            </div>
          )}
          {inventory < 5 && inventory > 0 && (
            <div className={styles.inventoryBadge}>
              ¡Solo {inventory} disponibles!
            </div>
          )}
          {inventory === 0 && (
            <div className={styles.soldOutBadge}>
              Agotado
            </div>
          )}
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          
          <div className={styles.ratingsContainer}>
            <div className={styles.stars}>
              {renderStars()}
            </div>
            <span className={styles.reviewCount}>({reviewCount})</span>
          </div>
          
          <div className={styles.priceContainer}>
            {discountPrice ? (
              <>
                <span className={styles.originalPrice}>EUR {price}</span>
                <span className={styles.price}>EUR {discountPrice}</span>
              </>
            ) : (
              <span className={styles.price}>EUR {price}</span>
            )}
          </div>
          
          <div className={styles.actions}>
            <HaramaraButton 
              variant={inCart ? "success" : "principal"}
              onClick={handleAddToCart}
              className={styles.addButton}
            >
              {inCart ? 'Añadido ✓' : 'Añadir al carrito'}
            </HaramaraButton>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;