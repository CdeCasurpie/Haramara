'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ActivityMap.module.css';

const ActivityMap = ({ activities = [], onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize the map when the component mounts
  useEffect(() => {
    // Load Leaflet library if not already loaded
    if (!document.getElementById('leaflet-css')) {
      const linkElement = document.createElement('link');
      linkElement.id = 'leaflet-css';
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      linkElement.crossOrigin = '';
      document.head.appendChild(linkElement);
    }

    if (typeof window !== "undefined") {
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

  // Update markers when activities change
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      updateMarkers();
    }
  }, [activities, mapLoaded]);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Default to Spain if no activities
    const defaultLocation = { lat: 40.416775, lng: -3.703790 };

    // Create map instance
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [defaultLocation.lat, defaultLocation.lng],
      zoom: 6,
      zoomControl: false
    });

    // Add zoom control to bottom right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(mapInstanceRef.current);

    // Add attribution
    L.control.attribution({
      position: 'bottomleft',
      prefix: ''
    }).addAttribution('© <a href="https://www.openstreetmap.org/copyright" style="color:#aaa;font-size:11px;">OpenStreetMap</a>').addTo(mapInstanceRef.current);

    // Add tile layer (map background)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    // Enable click on map to select location
    mapInstanceRef.current.on('click', (e) => {
      const location = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        name: null
      };
      
      // Reverse geocode to get location name (simulated here)
      setTimeout(() => {
        location.name = `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`;
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      }, 300);
    });

    setMapLoaded(true);
    updateMarkers();
  };

  const updateMarkers = () => {
    // Clear existing markers
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });
      markersRef.current = [];
    }

    if (!activities.length) return;

    // Create marker for each activity
    const markers = activities
      .filter(activity => activity.coordinates)
      .map(activity => {
        const { lat, lng } = activity.coordinates;
        
        // Create custom icon
        const customIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div class="${styles.marker}">
                   <div class="${styles.markerInner}"></div>
                   <div class="${styles.markerPrice}">€${activity.price}</div>
                 </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });
        
        // Create marker with popup
        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(mapInstanceRef.current);
          
        // Create popup with custom styling
        const popup = L.popup({
          closeButton: false,
          className: styles.customPopup,
          maxWidth: 250
        }).setContent(`
          <div class="${styles.popup}">
            <h3>${activity.title}</h3>
            <p>${activity.location}</p>
            <div class="${styles.popupRating}">
              ${'★'.repeat(Math.floor(activity.stars))}${'☆'.repeat(5 - Math.floor(activity.stars))}
            </div>
            <div class="${styles.popupPrice}">Desde €${activity.price}</div>
          </div>
        `);
        
        marker.bindPopup(popup);
        
        // Apply custom styles to popup elements after they're created
        marker.on('popupopen', function() {
          // Apply styles to popup DOM elements
          const popupContentWrapper = document.querySelector('.leaflet-popup-content-wrapper');
          if (popupContentWrapper) {
            popupContentWrapper.style.borderRadius = '8px';
            popupContentWrapper.style.padding = '0';
            popupContentWrapper.style.overflow = 'hidden';
            popupContentWrapper.style.boxShadow = '0 3px 14px rgba(0, 0, 0, 0.15)';
          }
          
          const popupContent = document.querySelector('.leaflet-popup-content');
          if (popupContent) {
            popupContent.style.margin = '0';
            popupContent.style.padding = '0';
          }
          
          const popupTip = document.querySelector('.leaflet-popup-tip');
          if (popupTip) {
            popupTip.style.backgroundColor = 'white';
          }
        });
        
        // Open popup on hover
        marker.on('mouseover', function() {
          this.openPopup();
        });
        
        return marker;
      });

    markersRef.current = markers;

    // Fit map to show all markers if there are any
    if (markers.length > 0) {
      try {
        const group = new L.featureGroup(markers);
        mapInstanceRef.current.fitBounds(group.getBounds(), {
          padding: [50, 50],
          maxZoom: 12
        });
      } catch (error) {
        console.error("Error fitting bounds:", error);
      }
    }
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

export default ActivityMap;