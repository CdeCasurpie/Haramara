'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './SimpleMap.module.css';

const SimpleMap = ({ location }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const linkElement = document.createElement('link');
      linkElement.id = 'leaflet-css';
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      linkElement.crossOrigin = '';
      document.head.appendChild(linkElement);
    }

    if (typeof window !== 'undefined') {
      if (!window.L) {
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        scriptElement.crossOrigin = '';
        scriptElement.onload = initializeMap;
        document.head.appendChild(scriptElement);
      } else {
        initializeMap();
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Actualizar la ubicación del marcador cuando cambie la prop location
    if (mapInstanceRef.current && mapLoaded && location) {
      mapInstanceRef.current.setView([location.lat, location.lng], 15);
      updateMarker();
    }
  }, [location, mapLoaded]);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: [location.lat, location.lng],
      zoom: 15,
      zoomControl: false
    });

    // Agregar control de zoom en la esquina inferior derecha
    L.control.zoom({
      position: 'bottomright'
    }).addTo(mapInstanceRef.current);

    // Agregar atribución en la esquina inferior izquierda
    L.control.attribution({
      position: 'bottomleft',
      prefix: ''
    }).addAttribution('© <a href="https://www.openstreetmap.org/copyright" style="color:#aaa;font-size:11px;">OpenStreetMap</a>').addTo(mapInstanceRef.current);

    // Usar el mismo mapa de estilo claro que ActivityMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    updateMarker();
    setMapLoaded(true);
  };

  const updateMarker = () => {
    if (!mapInstanceRef.current || !location) return;

    // Limpiar marcadores existentes
    mapInstanceRef.current.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Crear un icono personalizado para el marcador
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div class="${styles.marker}">
               <div class="${styles.markerInner}"></div>
             </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    // Añadir el marcador con el icono personalizado
    L.marker([location.lat, location.lng], { icon: customIcon })
      .addTo(mapInstanceRef.current);
  };

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.map}>
        {!mapLoaded && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
            <p>Cargando mapa...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMap;