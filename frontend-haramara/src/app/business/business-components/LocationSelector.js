'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './LocationSelector.module.css';

const LeafletLocationSelector = ({
  initialLocation = null,
  onLocationSelect
}) => {
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Inicializar el mapa después de que el componente se monte
  useEffect(() => {
    // Cargar los scripts de Leaflet si no están ya disponibles
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

  // Inicializar el mapa con estilo minimalista
  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Coordenadas por defecto (Madrid) o la ubicación inicial proporcionada
    const defaultLocation = selectedLocation || { lat: 40.416775, lng: -3.703790 };

    
    //minimaista
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [defaultLocation.lat, defaultLocation.lng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({
      position: 'bottomright'
    }).addTo(mapInstanceRef.current);

    L.control.attribution({
      position: 'bottomleft',
      prefix: ''
    }).addAttribution('© <a href="https://www.openstreetmap.org/copyright" style="color:#aaa;font-size:11px;">OpenStreetMap</a>').addTo(mapInstanceRef.current);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    if (selectedLocation) {
      addMarker(selectedLocation);
    }

    mapInstanceRef.current.on('click', (e) => {
      const location = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };
      
      setSelectedLocation(location);
      addMarker(location);
      getAddressFromCoordinates(location);
      
      if (onLocationSelect) {
        onLocationSelect(location);
      }
    });

    setMapLoaded(true);
  };

  // Añadir o actualizar marcador con estilo minimalista
  const addMarker = (location) => {
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }
    
    // Crear un icono personalizado más minimalista
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="
        width: 14px;
        height: 14px;
        background-color: #0052cc;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      "></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
    
    markerRef.current = L.marker([location.lat, location.lng], {
      draggable: true,
      icon: customIcon
    }).addTo(mapInstanceRef.current);
    
    // Permitir arrastrar el marcador para ajustar la ubicación
    markerRef.current.on('dragend', () => {
      const position = markerRef.current.getLatLng();
      const updatedLocation = {
        lat: position.lat,
        lng: position.lng
      };
      
      setSelectedLocation(updatedLocation);
      getAddressFromCoordinates(updatedLocation);
      
      if (onLocationSelect) {
        onLocationSelect(updatedLocation);
      }
    });
    
    mapInstanceRef.current.panTo([location.lat, location.lng]);
  };

  // Obtener dirección a partir de coordenadas usando la API de Nominatim (OpenStreetMap)
  const getAddressFromCoordinates = async (location) => {
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'es',
          "ngrok-skip-browser-warning": "true", } }
      );
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const data = await response.json();
      if (data && data.display_name) {
        // Simplificar la dirección para un estilo más minimalista
        const simplifiedAddress = simplifyAddress(data);
        setAddress(simplifiedAddress);
        
        if (onLocationSelect) {
          onLocationSelect({
            ...location,
            address: simplifiedAddress,
            fullAddress: data.display_name
          });
        }
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Simplificar la dirección para un aspecto más limpio
  const simplifyAddress = (data) => {
    if (!data.address) return data.display_name;
    
    const components = [];
    
    if (data.address.road) components.push(data.address.road);
    if (data.address.house_number) components.push(data.address.house_number);
    
    if (components.length === 0) {
      if (data.address.suburb) components.push(data.address.suburb);
      if (data.address.neighbourhood) components.push(data.address.neighbourhood);
    }
    
    if (data.address.city || data.address.town || data.address.village) {
      components.push(data.address.city || data.address.town || data.address.village);
    }
    
    if (components.length === 0) return data.display_name;
    return components.join(', ');
  };

  // Buscar ubicación por dirección usando Nominatim
  const searchLocation = async () => {
    if (!address.trim()) return;
    
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`,
        { headers: { 'Accept-Language': 'es',
          "ngrok-skip-browser-warning": "true", } }
      );
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const data = await response.json();
      setSearchResults(data);
      
      if (data.length > 0) {
        // Si hay resultados, usar el primero automáticamente
        selectSearchResult(data[0]);
      }
    } catch (error) {
      console.error('Error al buscar la dirección:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Buscar sugerencias de direcciones
  const getSuggestions = async (input) => {
    if (!input.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5`,
        { headers: { 'Accept-Language': 'es',
          "ngrok-skip-browser-warning": "true", } }
      );
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  };

  // Seleccionar un resultado de búsqueda
  const selectSearchResult = (result) => {
    const location = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon)
    };
    
    // Simplificar la dirección mostrada
    const displayAddress = result.display_name.split(',').slice(0, 3).join(',');
    setAddress(displayAddress);
    setSelectedLocation(location);
    setSearchResults([]);
    
    if (mapInstanceRef.current) {
      addMarker(location);
    }
    
    if (onLocationSelect) {
      onLocationSelect({
        ...location,
        address: displayAddress,
        fullAddress: result.display_name,
        osm_id: result.osm_id
      });
    }
  };

  // Manejar cambios en el input de dirección
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    
    // Debounce para evitar demasiadas llamadas a la API
    const debounceTimer = setTimeout(() => {
      getSuggestions(value);
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  };

  // Manejar la búsqueda con Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchLocation();
    }
  };

  return (
    <div className={styles.locationSelector}>
      <div className={styles.searchContainer}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.addressInput}
            placeholder="Ingresa una dirección"
            value={address}
            onChange={handleAddressChange}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={styles.searchButton}
            onClick={searchLocation}
            disabled={isSearching}
          >
            {isSearching ? '···' : 'Buscar'}
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className={styles.suggestions}>
            {searchResults.map((result) => (
              <div
                key={result.place_id}
                className={styles.suggestionItem}
                onClick={() => selectSearchResult(result)}
              >
                {/* Simplificar las sugerencias para un aspecto más limpio */}
                {result.display_name.split(',').slice(0, 3).join(',')}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div 
        ref={mapRef} 
        className={styles.map}
      >
        {!mapLoaded && <div className={styles.mapLoading}>Cargando mapa...</div>}
      </div>
      
      <div className={styles.footer}>
        {selectedLocation ? (
          <div className={styles.coordinatesInfo}>
            <span>Lat: {selectedLocation.lat.toFixed(5)}</span>
            <span>Lng: {selectedLocation.lng.toFixed(5)}</span>
          </div>
        ) : (
          <div className={styles.instructions}>
            Haz clic en el mapa para seleccionar una ubicación
          </div>
        )}
      </div>
    </div>
  );
};

export default LeafletLocationSelector;