'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ActivityForm.module.css';
import LocationField from './LocationField';
import API_BASE_URL from '@/config';

const ActivityForm = ({
  activity,
  setSelectedActivity
}) => {
  const [newCharacteristic, setNewCharacteristic] = React.useState({ name: '', value: '' });
  const [imageSources, setImageSources] = useState({});
  const fileInputRef = useRef(null);

  // Si la actividad es null, se crea una nueva actividad
  useEffect(() => {
    if (activity === null) {
      setSelectedActivity({
        title: '',
        description: '',
      })
    }
  }, [activity])
  // Manejar cambios en los campos principales
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedActivity({
      ...activity,
      [name]: value
    });
  };

  // Manejar la selección de ubicación
  const handleLocationSelect = (location) => {
    setSelectedActivity({
      ...activity,
      location: location
    });
  };

  // Manejar la subida de imágenes
  const handleImageUpload = (e) => {
    console.log("handleImageUpload");
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...(activity.images || [])];
      
      files.forEach(file => {
        // En un entorno real, aquí subirías el archivo a tu servidor o almacenamiento en la nube
        // Por ahora, solo creamos URLs temporales para las vistas previas
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            url: reader.result,
            file: file
          });
          
          setSelectedActivity({
            ...activity,
            images: newImages
          });
        };
        reader.readAsDataURL(file);
      });
    }

    console.log(activity);
  };

  // Eliminar una imagen
  const removeImage = (index) => {
    const updatedImages = [...activity.images];
    updatedImages.splice(index, 1);
    
    setSelectedActivity({
      ...activity,
      images: updatedImages
    });
  };

  // Botón para abrir el selector de archivos
  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  // Función para manejar errores de carga de imágenes
  const handleImageError = (index, imageUrl) => {
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
  const getImageSource = (index, imageUrl) => {
    const sourceState = imageSources[index] || 0;
    
    switch (sourceState) {
      case 0: // Primer intento: con dominio del backend
        // Verificar si la URL ya es una URL completa o una URL de datos
        if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
          return imageUrl;
        }
        return `${API_BASE_URL}${imageUrl}`;
      case 1: // Segundo intento: solo la URL
        return imageUrl;
      default: // Último recurso: imagen placeholder
        return '/images/general/placeholder_image.png';
    }
  };

  // Añadir una nueva característica
  const addCharacteristic = () => {
    if (newCharacteristic.name && newCharacteristic.value) {
      const updatedCharacteristics = [
        ...(activity.characteristics || []),
        { ...newCharacteristic }
      ];
      setSelectedActivity({
        ...activity,
        characteristics: updatedCharacteristics
      });
      setNewCharacteristic({ name: '', value: '' });
    }
  };

  // Manejar evento de tecla para añadir característica al presionar Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newCharacteristic.name && newCharacteristic.value) {
      e.preventDefault();
      addCharacteristic();
    }
  };

  // Eliminar una característica
  const removeCharacteristic = (index) => {
    const updatedCharacteristics = activity.characteristics.filter((_, i) => i !== index);
    setSelectedActivity({
      ...activity,
      characteristics: updatedCharacteristics
    });
  };

  return (
    <div className={styles.formContainer}>
      {activity && (
        <>      
        {/* Primera fila: Título y Ubicación */}
        <div className={styles.formRow}>
          <div className={styles.formGroup + ' ' + styles.width55percentage}>
            <label className={styles.label}>Nombre de la Actividad:</label>
            <input
              type="text"
              name="title"
              className={styles.input}
              value={activity.title || ''}
              onChange={handleInputChange}
              placeholder="Título de la actividad"
            />
          </div>
          
          <div className={styles.formGroup + ' ' + styles.width40percentage}>
            <label className={styles.label}>Ubicación:</label>
            <LocationField 
              initialLocation={activity.location}
              initialAddress={activity.location?.address || ''}
              onLocationSelect={handleLocationSelect}
              placeholder="Seleccionar ubicación"
            />
          </div>
        </div>

        {/* Segunda fila: Descripción */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Descripción:</label>
          <textarea
            name="description"
            className={styles.textarea}
            value={activity.description || ''}
            onChange={handleInputChange}
            placeholder="Describe la actividad en detalle..."
            rows={4}
          />
        </div>

        {/* Tercera fila: Valores numéricos */}
        <div className={styles.formRow}>
          <div className={styles.formGroup + ' ' + styles.width47percentage}>
            <label className={styles.label}>Precio por persona:</label>
            <input
              type="number"
              name="price_per_person"
              className={`${styles.input} ${styles.hideSpinners}`}
              value={activity.price_per_person || ''}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
            />
          </div>
          
          <div className={styles.formGroup + ' ' + styles.width47percentage}>
            <label className={styles.label}>Cupos iniciales:</label>
            <input
              type="number"
              name="initial_vacancies"
              className={`${styles.input} ${styles.hideSpinners}`}
              value={activity.initial_vacancies || ''}
              onChange={handleInputChange}
              placeholder="15"
            />
          </div>
        </div>

        {/* Cuarta fila: Edad mínima y etiquetas */}
        <div className={styles.formRow}>
          <div className={styles.formGroup + ' ' + styles.width35percentage}>
            <label className={styles.label}>Edad mínima:</label>
            <input
              type="number"
              name="min_age"
              className={`${styles.input} ${styles.hideSpinners}`}
              value={activity.min_age || '15'}
              onChange={handleInputChange}
              placeholder="15"
            />
          </div>
          
          <div className={styles.formGroup + ' ' + styles.width60percentage}>
            <label className={styles.label}>Etiquetas (separadas por comas):</label>
            <input
              type="text"
              name="tags"
              className={styles.input}
              value={activity.tags || ''}
              onChange={handleInputChange}
              placeholder="playa, familia, deportes, aventura"
            />
          </div>
        </div>

        {/* Quinta fila: Imágenes */}
        <div className={styles.formGroup}>
          <div className={styles.imagesHeader}>
            <label className={styles.label}>Imágenes de la actividad:</label>
            <button 
              type="button" 
              className={styles.addButton}
              onClick={handleImageButtonClick}
            >
              + Añadir imágenes
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              className={styles.hiddenFileInput} 
              onChange={handleImageUpload}
              accept="image/*"
              multiple
            />
          </div>
          
          <div className={styles.imageGallery}>
            {activity.images && activity.images.length > 0 ? (
              activity.images.map((image, index) => (
                <div key={index} className={styles.imageThumbContainer}>
                  <img 
                    src={getImageSource(index, image.url)}
                    alt={`Imagen ${index + 1}`} 
                    className={styles.imageThumb}
                    onError={() => handleImageError(index, image.url)}
                  />
                  <button 
                    type="button" 
                    className={styles.removeImageButton}
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.uploadImagePlaceholder} onClick={handleImageButtonClick}>
                Subir imagen
              </div>
            )}
          </div>
        </div>
        
        {/* Sexta fila: Características */}
        <div className={styles.formGroup}>
          <div className={styles.characteristicsHeader}>
            <label className={styles.label}>Características (Nombre | Valor):</label>
            <button 
              type="button" 
              className={styles.addButton}
              onClick={addCharacteristic}
            >
              + Nueva característica
            </button>
          </div>
          
          <div className={styles.characteristicsList}>
            {activity.characteristics && activity.characteristics.map((char, index) => (
              <div key={index} className={styles.characteristicItem}>
                <div className={styles.charName}>{char.name}</div>
                <div className={styles.charValue}>{char.value}</div>
                <button 
                  type="button" 
                  className={styles.removeButton}
                  onClick={() => removeCharacteristic(index)}
                >
                  ×
                </button>
              </div>
            ))}
            
            <div className={styles.characteristicInputs}>
              <input
                type="text"
                className={styles.charNameInput}
                placeholder="Nombre"
                value={newCharacteristic.name}
                onChange={(e) => setNewCharacteristic({...newCharacteristic, name: e.target.value})}
                onKeyDown={handleKeyDown}
              />
              <input
                type="text"
                className={styles.charValueInput}
                placeholder="Valor"
                value={newCharacteristic.value}
                onChange={(e) => setNewCharacteristic({...newCharacteristic, value: e.target.value})}
                onKeyDown={handleKeyDown}
              />
              <button 
                type="button" 
                className={styles.removeButton}
                onClick={() => setNewCharacteristic({ name: '', value: '' })}
              >
                ×
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default ActivityForm;