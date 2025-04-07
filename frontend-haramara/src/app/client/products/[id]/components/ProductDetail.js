'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import API_BASE_URL from '@/config';
import HaramaraButton from '@/components/HaramaraButton';
import { fetchProductDetail, addToCart } from '../utils';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ id }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product details when the component mounts or the ID changes
  useEffect(() => {
    const getProductDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchProductDetail(id);
        
        if (data.success && data.product) {
          setProduct(data.product);
          
          // Select first variant by default if available
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0]);
          }
        } else {
          throw new Error(data.message || 'Error fetching product');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('No pudimos cargar la información del producto. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    getProductDetail();
  }, [id]);

  // Image navigation handlers
  const handleNextImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Handle selection of product variant
  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Handle add to cart button click
  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    try {
      setAddingToCart(true);
      
      const itemToAdd = {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
        variantName: selectedVariant.name
      };
      
      const result = await addToCart(itemToAdd);
      
      if (result.success) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.productGrid}>
          {/* Left side - Image Gallery with loading effect */}
          <div className={styles.galleryContainer}>
            <div className={styles.mainImageContainerLoading}>
              <div className={styles.skeletonImage}></div>
            </div>
            <div className={styles.thumbnailsContainer}>
              {[1, 2, 3].map((_, index) => (
                <div key={index} className={styles.skeletonThumbnail}></div>
              ))}
            </div>
          </div>
          
          {/* Right side - Product details with loading effect */}
          <div className={styles.detailsContainer}>
            <div className={styles.skeletonTitle}></div>
            
            <div className={styles.skeletonPriceContainer}>
              <div className={styles.skeletonOriginalPrice}></div>
              <div className={styles.skeletonPrice}></div>
            </div>
            
            <div className={styles.skeletonStock}></div>
            
            <div className={styles.skeletonDescription}></div>
            
            <div className={styles.skeletonVariantsTitle}></div>
            <div className={styles.skeletonVariantsList}>
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className={styles.skeletonVariant}></div>
              ))}
            </div>
            
            <div className={styles.skeletonActionContainer}>
              <div className={styles.skeletonQuantity}></div>
              <div className={styles.skeletonButton}></div>
            </div>
            
            <div className={styles.skeletonTags}>
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className={styles.skeletonTag}></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Specifications with loading effect */}
        <div className={styles.specificationsContainer}>
          <div className={styles.skeletonSpecTitle}></div>
          <div className={styles.skeletonSpecTable}></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Ocurrió un error</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={styles.reloadButton}
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  // If product data is not available after loading
  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Producto no encontrado</h2>
        <p>Lo sentimos, no pudimos encontrar el producto que buscas.</p>
      </div>
    );
  }

  // Render the actual product detail
  return (
    <div className={styles.container}>
      <div className={styles.productGrid}>
        {/* Left side - Image Gallery */}
        <div className={styles.galleryContainer}>
          <div className={styles.mainImageContainer}>
            {product.images && product.images.length > 0 ? (
              <Image
                src={`${product.images[currentImageIndex]}`}
                alt={product.name}
                fill
                className={styles.mainImage}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className={styles.noImage}>No hay imagen disponible</div>
            )}
            
            {product.images && product.images.length > 1 && (
              <>
                <button 
                  className={`${styles.arrowButton} ${styles.prevButton}`}
                  onClick={handlePrevImage}
                  aria-label="Imagen anterior"
                >
                  &#x276E;
                </button>
                <button 
                  className={`${styles.arrowButton} ${styles.nextButton}`}
                  onClick={handleNextImage}
                  aria-label="Imagen siguiente"
                >
                  &#x276F;
                </button>
              </>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnailsContainer}>
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`${styles.thumbnail} ${currentImageIndex === index ? styles.activeThumbnail : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={`${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right side - Product details */}
        <div className={styles.detailsContainer}>
          <h1 className={styles.productName}>{product.name}</h1>
          
          <div className={styles.priceContainer}>
            {selectedVariant?.original_price && selectedVariant.original_price > selectedVariant.price ? (
              <>
                <span className={styles.originalPrice}>EUR {selectedVariant.original_price}</span>
                <span className={styles.price}>EUR {selectedVariant.price}</span>
              </>
            ) : (
              <span className={styles.price}>EUR {selectedVariant?.price}</span>
            )}
          </div>
          
          <p className={styles.stockInfo}>
            {selectedVariant ? 
              selectedVariant.stock > 0 ? 
                `${selectedVariant.stock} unidades disponibles` : 
                'Agotado' : 
              'Seleccione una variante'}
          </p>
          
          <div className={styles.description}>
            <p>{product.general_description}</p>
          </div>
          
          {/* Variants selection */}
          {product.variants && product.variants.length > 0 && (
            <div className={styles.variantsContainer}>
              <h3 className={styles.variantsTitle}>Opciones disponibles:</h3>
              <div className={styles.variantsList}>
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`${styles.variantButton} ${selectedVariant?.id === variant.id ? styles.selectedVariant : ''}`}
                    onClick={() => handleSelectVariant(variant)}
                    disabled={variant.stock <= 0}
                  >
                    {variant.name}
                    {variant.stock <= 0 && <span className={styles.outOfStock}> (Agotado)</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity and Add to cart */}
          <div className={styles.actionContainer}>
            <div className={styles.quantityContainer}>
              <label htmlFor="quantity" className={styles.quantityLabel}>Cantidad:</label>
              <div className={styles.quantityControls}>
                <button 
                  className={styles.quantityButton}
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  className={styles.quantityInput}
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={selectedVariant?.stock || 1}
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                />
                <button 
                  className={styles.quantityButton}
                  onClick={() => quantity < (selectedVariant?.stock || 1) && setQuantity(quantity + 1)}
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                >
                  +
                </button>
              </div>
            </div>
            
            <HaramaraButton 
              variant="principal" 
              onClick={handleAddToCart}
              className={styles.addButton}
              disabled={!selectedVariant || selectedVariant.stock <= 0 || addingToCart}
            >
              {addingToCart ? 'AGREGANDO...' : addedToCart ? '¡AGREGADO!' : !selectedVariant || selectedVariant.stock <= 0 ? 'AGOTADO' : 'AGREGAR'}
            </HaramaraButton>
          </div>
          
          {/* Tags */}
          {product.tags && (
            <div className={styles.tagsContainer}>
              {product.tags.split(',').map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Specifications */}
      {selectedVariant && selectedVariant.specifications && (
        <div className={styles.specificationsContainer}>
          <h2 className={styles.specTitle}>Especificaciones:</h2>
          <table className={styles.specTable}>
            <tbody>
              {Object.entries(selectedVariant.specifications).map(([key, value], index) => (
                <tr key={index} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td className={styles.specName}>{key}</td>
                  <td className={styles.specValue}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;