"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";
import API_BASE_URL from "@/config";

const Gallery = ({ images, autoPlay = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [imageSources, setImageSources] = useState({});

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      // Inicia la transición de fade out
      setFade(false);

      setTimeout(() => {
        goToNext();
        setFade(true);
      }, 500); //  duración del fade
    }, 2500);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay]);

  // Función para manejar errores de carga de imágenes
  const handleImageError = (index) => {
    // Obtener el estado actual de esta imagen
    const currentSource = imageSources[index] || 0;
    
    // Actualizar al siguiente estado
    const nextSource = currentSource + 1;
    setImageSources({
      ...imageSources,
      [index]: nextSource
    });
  };

  // Función para determinar la fuente de la imagen según el estado
  const getImageSrc = (index) => {
    if (!images || !images[index]) {
      return "/images/general/placeholder_image.png";
    }

    const image = images[index];
    const sourceState = imageSources[index] || 0;
    
    switch (sourceState) {
      case 0: // Primer intento: con dominio del backend
        // Verificar si la URL ya es completa o una URL de datos
        if (image.startsWith('http') || 
            image.startsWith('data:') || 
            image.startsWith('blob:')) {
          return image;
        }
        return `${API_BASE_URL}${image}`;
      
      case 1: // Segundo intento: solo la URL
        return image.startsWith('/') ? image : `/${image}`;
      
      default: // Último recurso: imagen placeholder
        return "/images/general/placeholder_image.png";
    }
  };

  return (
    <div className={styles.galleryContainer}>
      <div
        className={styles.imageWrapper}
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 0.5s ease-in-out"
        }}
      >
        <Image
          src={getImageSrc(currentIndex)}
          alt="Imagen de la galería"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
          onError={() => handleImageError(currentIndex)}
        />
      </div>
      {!autoPlay && (
        <>
          <button className={styles.arrowButton} onClick={goToPrevious}>
            &#x276E; {/* Símbolo < */}
          </button>
          <button className={styles.arrowButton} onClick={goToNext}>
            &#x276F; {/* Símbolo > */}
          </button>
        </>
      )}
    </div>
  );
};

export default Gallery;