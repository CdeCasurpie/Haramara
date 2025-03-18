'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './CustomSlider.module.css';

const CustomSlider = ({ 
  children, 
  title = 'Slider',
  itemHeight = 100, // Altura de cada item en píxeles
  gap = 16, // Espacio entre items en píxeles
  maxHeight = 550, // Altura máxima opcional (si no se especifica, se usa la altura del contenedor)
  showBorder = true
}) => {
  const [visibleItems, setVisibleItems] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  // Calcular cuántos ítems pueden mostrarse basándose en la altura disponible
  useEffect(() => {
    const calculateVisibleItems = () => {
      if (sliderRef.current) {
        // Usar la altura especificada o la altura del contenedor
        const availableHeight = maxHeight || sliderRef.current.clientHeight;
        
        // Calcular cuántos ítems completos caben en la altura disponible
        // considerando la altura de cada ítem más el espacio entre ellos
        const itemsPerView = Math.floor(availableHeight / (itemHeight + gap));
        
        // Asegurarse de que al menos 1 ítem sea visible
        setVisibleItems(Math.max(1, itemsPerView));
      }
    };

    // Cálculo inicial
    calculateVisibleItems();

    // Recalcular cuando cambia el tamaño de la ventana
    const handleResize = () => {
      calculateVisibleItems();
      // Resetear a la primera página si la página actual estaría fuera de límites
      setCurrentPage(prevPage => {
        const maxPage = Math.ceil(React.Children.count(children) / visibleItems) - 1;
        return Math.min(prevPage, Math.max(0, maxPage));
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('resize', handleResize);
      }
    }
  }, [children, itemHeight, gap, maxHeight, visibleItems]);

  // Número total de páginas
  const childrenCount = React.Children.count(children);
  const totalPages = Math.ceil(childrenCount / visibleItems);

  // Manejar navegación
  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  // Calcular qué ítems mostrar
  const startIndex = currentPage * visibleItems;
  const endIndex = Math.min(startIndex + visibleItems, childrenCount);
  const visibleChildren = React.Children.toArray(children).slice(startIndex, endIndex);

  // Crear un estilo dinámico para el contenedor de ítems
  const itemsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${gap}px`,
    maxHeight: maxHeight ? `${maxHeight}px` : 'auto',
    height: itemHeight * visibleItems + gap * (visibleItems - 1),
    overflowY: 'hidden',
  };

  return (
    <div className={styles.sliderContainer + (showBorder ? ` ${styles.border}` : '')} ref={containerRef}>
      {title && <h2 className={styles.title}>{title}</h2>}
      
      <div className={styles.sliderContent} ref={sliderRef}>
        <div 
          className={styles.itemsContainer} 
          style={itemsContainerStyle}
        >
          {visibleChildren.map((child, index) => (
            <div key={index} style={{ height: itemHeight,}}>
              {child}
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className={styles.navigationButtons}>
            <button 
              className={`${styles.navButton} ${currentPage === 0 ? styles.disabled : ''}`}
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              aria-label="Página anterior"
            >
              &lt;
            </button>
            <button 
              className={`${styles.navButton} ${currentPage === totalPages - 1 ? styles.disabled : ''}`}
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              aria-label="Página siguiente"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSlider;