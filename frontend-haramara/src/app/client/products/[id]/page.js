// app/client/products/[id]/page.js
'use client';

import React from 'react';
import ProductDetail from './components/ProductDetail';
import SimilarProducts from './components/SimilarProducts';
import styles from './page.module.css';

const ProductDetailPage = ({ params }) => {
  // Unwrap the params object using React.use()
  const unwrappedParams = React.use(params);
  const productId = unwrappedParams.id;
  
  return (
    <div className={styles.pageContainer}>
      <ProductDetail id={productId} />
      <div className={styles.similarProductsSection}>
        <h2 className={styles.sectionTitle}>Productos relacionados</h2>
        <SimilarProducts productId={productId} />
      </div>
    </div>
  );
};

export default ProductDetailPage;