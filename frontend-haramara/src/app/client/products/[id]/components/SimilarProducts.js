'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { fetchSimilarProducts } from '../utils';
import styles from './SimilarProducts.module.css';

const SimilarProducts = ({ productId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSimilarProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchSimilarProducts(productId);
        
        if (data.success && data.products) {
          setProducts(data.products);
        } else {
          throw new Error(data.message || 'Error fetching similar products');
        }
      } catch (err) {
        console.error('Error fetching similar products:', err);
        setError('No pudimos cargar productos similares.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      getSimilarProducts();
    }
  }, [productId]);

  // Loading state
  if (loading) {
    return (
      <div className={styles.productsGrid}>
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className={styles.productCardLoading}>
            <div className={styles.loadingImage}></div>
            <div className={styles.loadingTitle}></div>
            <div className={styles.loadingPrice}></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  // No products found
  if (!products || products.length === 0) {
    return <div className={styles.noProducts}>No hay productos similares disponibles</div>;
  }

  // Products found - Adapted to match your ProductCard component props
  return (
    <div className={styles.productsGrid}>
      {products.map(product => (
        <ProductCard 
          key={product.id}
          id={product.id}
          title={product.name}
          price={product.original_price || product.price}
          discountPrice={product.original_price ? product.price : null}
          imageUrl={product.image}
          inventory={product.stock || 0}
          ratings={product.rating || 4.5}
          reviewCount={product.review_count || 10}
          href={`/client/products/${product.id}`}
        />
      ))}
    </div>
  );
};

export default SimilarProducts;