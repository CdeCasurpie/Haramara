"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";
import API_BASE_URL from "@/config";

const Gallery = ({ images, autoPlay = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

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

  // Function to determine the image source with fallbacks
  const getImageSrc = (index) => {
    if (!images || !images[index]) {
      return "/images/general/placeholder_image.png";
    }

    const image = images[index];

    // If there's an error for this image, try local path
    if (imageErrors[index]) {
      // Try to load from local public directory
      return image.startsWith("/") ? image : `/${image}`;
    }

    // Use blob URL directly
    if (image.startsWith("blob:")) {
      return image;
    }

    // Use API_BASE_URL if it's a relative path from backend
    return API_BASE_URL + image;
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
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