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
      document.head.appendChild(linkElement);
    }

    if (typeof window !== 'undefined') {
      if (!window.L) {
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
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

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: [location.lat, location.lng],
      zoom: 15,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    L.marker([location.lat, location.lng]).addTo(mapInstanceRef.current);
    setMapLoaded(true);
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