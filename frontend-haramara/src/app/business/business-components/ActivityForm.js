'use client';

import React, { useEffect, useState, useRef } from 'react';
import styles from './ActivityForm.module.css';

const ActivityForm = ({
  initialData = {
    title: '',
    description: '',
    price_per_person: '',
    min_age: '15',
    initial_vacancies: '',
    id_ubicacion: '',
    tags: '',
    characteristics: [],
    images: []
  },
  setInitialData,
  onSubmit,
  locations = []
}) => {
  const [activity, setActivity] = useState(initialData);
  const [newCharacteristic, setNewCharacteristic] = useState({ name: '', value: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (setInitialData) {
      setInitialData(activity);
    }
  }, [activity, setInitialData]);

  // Manejar cambios en los campos principales
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActivity({
      ...activity,
      [name]: value
    });
  };

  // Manejar la subida de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...activity.images];
      
      files.forEach(file => {
        // En un entorno real, aquí subirías el archivo a tu servidor o almacenamiento en la nube
        // Por ahora, solo creamos URLs temporales para las vistas previas
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            url: reader.result,
            file: file
          });
          
          setActivity({
            ...activity,
            images: newImages
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Eliminar una imagen
  const removeImage = (index) => {
    const updatedImages = [...activity.images];
    updatedImages.splice(index, 1);
    
    setActivity({
      ...activity,
      images: updatedImages
    });
  };

  // Botón para abrir el selector de archivos
  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  // Añadir una nueva característica
  const addCharacteristic = () => {
    if (newCharacteristic.name && newCharacteristic.value) {
      const updatedCharacteristics = [
        ...activity.characteristics,
        { ...newCharacteristic }
      ];
      setActivity({
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
    setActivity({
      ...activity,
      characteristics: updatedCharacteristics
    });
  };

  // Crear la actividad
  const handleCreateActivity = () => {
    if (onSubmit) {
      onSubmit(activity);
    }
  };

  return (
    <div className={styles.formContainer}>
      {/* Primera fila: Título y Ubicación */}
      <div className={styles.formRow}>
        <div className={styles.formGroup + ' ' + styles.width55percentage}>
          <label className={styles.label}>Nombre de la Actividad:</label>
          <input
            type="text"
            name="title"
            className={styles.input}
            value={activity.title}
            onChange={handleInputChange}
            placeholder="Título de la actividad"
          />
        </div>
        
        <div className={styles.formGroup + ' ' + styles.width40percentage}>
          <label className={styles.label}>Ubicación:</label>
          <select
            name="id_ubicacion"
            className={styles.select}
            value={activity.id_ubicacion}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar ubicación</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Segunda fila: Descripción */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Descripción:</label>
        <textarea
          name="description"
          className={styles.textarea}
          value={activity.description}
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
            value={activity.price_per_person}
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
            value={activity.initial_vacancies}
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
            value={activity.min_age}
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
            value={activity.tags}
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
          {activity.images.length > 0 ? (
            activity.images.map((image, index) => (
              <div key={index} className={styles.imageThumbContainer}>
                <img 
                  src={image.url} 
                  alt={`Imagen ${index + 1}`} 
                  className={styles.imageThumb} 
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
          {activity.characteristics.map((char, index) => (
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
              onChange={(e) => setNewCharacteristic({...newCharacteristic, name: newCharacteristic.name, value: e.target.value})}
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
      
      {/* Botón de crear */}
      <div className={styles.formFooter}>
        <button 
          type="button" 
          className={styles.createButton}
          onClick={handleCreateActivity}
        >
          Crear actividad
        </button>
      </div>
    </div>
  );
};

export default ActivityForm;