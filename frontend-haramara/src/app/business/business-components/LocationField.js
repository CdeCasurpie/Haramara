'use client';

import React, { useState, useRef } from 'react';
import LeafletLocationSelector from './LocationSelector';
import styles from './LocationField.module.css';

const LocationField = ({
  initialLocation = null,
  initialAddress = '',
  onLocationSelect,
  placeholder = 'Ingresa una dirección'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState(initialAddress || '');
  const [location, setLocation] = useState(initialLocation);
  const modalRef = useRef(null);

  // Manejar la selección de ubicación desde el mapa
  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setAddress(selectedLocation.address || `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`);
    
    if (onLocationSelect) {
      onLocationSelect(selectedLocation);
    }
  };

  // Abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
    // Prevenir scroll en el body mientras el modal está abierto
    document.body.style.overflow = 'hidden';
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Restaurar scroll
    document.body.style.overflow = 'auto';
  };

  // Cerrar el modal si se hace clic fuera de su contenido
  const handleModalOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  // Manejar cambios en el input de dirección
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  return (
    <div className={styles.locationField}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.addressInput}
          value={address}
          onChange={handleAddressChange}
          placeholder={placeholder}
          readOnly
        />
        <button 
          type="button"
          className={styles.mapButton}
          onClick={openModal}
          aria-label="Seleccionar ubicación en el mapa"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="12" cy="10" r="3" />
            <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z" />
          </svg>
        </button>
      </div>

      {/* Modal del mapa */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleModalOutsideClick}>
          <div className={styles.modalContent} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Seleccionar ubicación</h3>
              <button 
                className={styles.closeButton}
                onClick={closeModal}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <LeafletLocationSelector 
                initialLocation={location}
                onLocationSelect={handleLocationSelect}
              />
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.confirmButton}
                onClick={closeModal}
              >
                Confirmar ubicación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationField;