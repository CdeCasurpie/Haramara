"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";

const Gallery = ({ images, autoPlay = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

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
  }
  , [currentIndex, autoPlay]);

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
          src={images[currentIndex] || "/images/general/placeholder.png"}
          alt="Imagen de la galería"
          fill
          style={{ objectFit: "cover" }}
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
