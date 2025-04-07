'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import styles from './SingleCourseView.module.css';
import SimpleMap from '@/components/SimpleMap';
import Gallery from '@/components/Gallery';

export default function SingleCourseView({ courseData }) {
  // Estado de carga
  if (!courseData) {
    return (
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          {/* Skeleton de imagen móvil */}
          <div className={styles.mobileImageContainer}>
            <div className={styles.skeletonImage}></div>
          </div>

          {/* Columna izquierda - Skeleton */}
          <div className={styles.leftColumn}>
            {/* Skeleton de galería */}
            <div className={styles.galleryContainer}>
              <div className={styles.skeletonGallery}></div>
            </div>

            {/* Skeleton de turnos */}
            <div className={styles.turnosSection}>
              <div className={styles.skeletonTitle}></div>
              
              <div className={styles.turnosList}>
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className={styles.skeletonCard}>
                    <div className={styles.skeletonLine}></div>
                    <div className={styles.skeletonDays}>
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className={styles.skeletonCircle}></div>
                      ))}
                    </div>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonButtonWrapper}>
                      <div className={styles.skeletonButton}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha - Skeleton */}
          <div className={styles.rightColumn}>
            {/* Cabecera skeleton */}
            <div className={styles.courseHeader}>
              <div className={styles.courseHeaderLeft}>
                <div className={styles.skeletonTitleLarge}></div>
                <div className={styles.skeletonLine}></div>
                <div className={styles.skeletonLine} style={{ width: '70%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '50%' }}></div>
              </div>
              
              <div className={styles.courseHeaderRight}>
                <div className={styles.skeletonLocation}></div>
                <div className={styles.skeletonPrice}></div>
              </div>
            </div>

            {/* Contenido skeleton */}
            <div className={styles.courseContent}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonParagraph}></div>
              <div className={styles.skeletonParagraph}></div>
              
              <div className={styles.skeletonTitle} style={{ marginTop: '30px' }}></div>
              <div className={styles.skeletonList}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={styles.skeletonListItem}></div>
                ))}
              </div>
              
              <div className={styles.skeletonTitle} style={{ marginTop: '30px' }}></div>
              <div className={styles.skeletonList}>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className={styles.skeletonListItem}></div>
                ))}
              </div>
              
              <div className={styles.skeletonTitle} style={{ marginTop: '30px' }}></div>
              
              {/* Mapa skeleton */}
              <div className={styles.locationSection}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonMap}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Contenido real
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