'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import styles from './SingleCourseView.module.css';
import SimpleMap from '@/components/SimpleMap';
import Gallery from '@/components/Gallery';

export default function SingleCourseView({ courseData }) {
  if (!courseData) {
    return <div className={styles.loading}>Cargando información del curso...</div>;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        {/* Imagen principal en la parte superior (solo para móviles) */}
        <div className={styles.mobileImageContainer}>
          {courseData.images && courseData.images.length > 0 ? (
            <Image 
              src={courseData.images[0]} 
              alt={courseData.titulo}
              width={500}
              height={300}
              className={styles.mobileImage}
              priority
            />
          ) : (
            <div className={styles.noImage}>No hay imagen disponible</div>
          )}
        </div>

        {/* Columna izquierda - Turnos disponibles */}
        <div className={styles.leftColumn}>
          {/* Galería de imágenes */}
          <div className={styles.galleryContainer}>
            {courseData.images && courseData.images.length > 0 ? (
              <Gallery 
                images={courseData.images.map(img => typeof img === 'string' ? img : img.url)} 
              />
            ) : (
              <div className={styles.noImage}>No hay imágenes disponibles</div>
            )}
          </div>

          {/* Turnos disponibles */}
          <div className={styles.turnosSection}>
            <h3 className={styles.turnosTitle}>Turnos disponibles:</h3>
            
            <div className={styles.turnosList}>
              {courseData.turnos && courseData.turnos.map((turno) => (
                <div key={turno.id} className={styles.turnoCard}>
                  <div className={styles.turnoTime}>
                    {turno.startTime} - {turno.endTime}
                  </div>
                  
                  <div className={styles.turnoDays}>
                    <div className={`${styles.dayCircle} ${turno.days.L ? styles.activeDay : ''}`}>L</div>
                    <div className={`${styles.dayCircle} ${turno.days.M ? styles.activeDay : ''}`}>M</div>
                    <div className={`${styles.dayCircle} ${turno.days.X ? styles.activeDay : ''}`}>X</div>
                    <div className={`${styles.dayCircle} ${turno.days.J ? styles.activeDay : ''}`}>J</div>
                    <div className={`${styles.dayCircle} ${turno.days.V ? styles.activeDay : ''}`}>V</div>
                    <div className={`${styles.dayCircle} ${turno.days.S ? styles.activeDay : ''}`}>S</div>
                    <div className={`${styles.dayCircle} ${turno.days.D ? styles.activeDay : ''}`}>D</div>
                  </div>
                  
                  <div className={styles.turnoVacancies}>
                    {turno.freeVacancies > 0 ? (
                      <div className={styles.vacanciesCount}>{turno.freeVacancies} CUPOS RESTANTES</div>
                    ) : (
                      <div className={styles.agotado}>AGOTADO</div>
                    )}
                  </div>
                  
                  <button 
                    className={styles.reserveButton}
                    disabled={turno.freeVacancies === 0}
                  >
                    Reservar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha - Detalles del curso */}
        <div className={styles.rightColumn}>
          {/* Cabecera con título, ubicación y precio */}
          <div className={styles.courseHeader}>
            <div className={styles.courseHeaderLeft}>
              <h1 className={styles.courseTitle}>{courseData.titulo}</h1>
              
              <div className={styles.courseDate}>
                {courseData.start_date} - {courseData.end_date}
              </div>
              
              <div className={styles.courseLevel}>
                {courseData.level}
              </div>
              
              <div className={styles.courseAge}>
                Desde los {courseData.min_age} años
              </div>
            </div>
            
            <div className={styles.courseHeaderRight}>
              <div className={styles.location}>
                <MapPin size={20} />
                <span>{courseData.ubicacion}</span>
              </div>
              
              <div className={styles.priceContainer}>
                <div className={styles.price}>{courseData.price}€</div>
                <div className={styles.priceCaption}>precio/persona</div>
              </div>
            </div>
          </div>

          {/* Contenido del curso */}
          <div className={styles.courseContent}>
            {/* El contenido completo viene del backend, incluyendo títulos */}
            <div dangerouslySetInnerHTML={{ __html: courseData.fullDescription }} />
            
            {/* Sección de ubicación con mapa */}
            <div className={styles.locationSection}>
              <h3 className={styles.locationTitle}>Ubicación</h3>
              <div className={styles.mapContainer}>
                <SimpleMap 
                  location={{"lat": courseData.coordinates?.lat, "lng":courseData.coordinates?.lng}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}