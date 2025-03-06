'use client';

import React, { useEffect, useState, useRef } from 'react';
import styles from './CourseForm.module.css';

const CourseForm = ({
  initialData = {
    title: '',
    price: '',
    start_date: '',
    end_date: '',
    message: '',
    min_age: '15',
    id_ubicacion: '',
    images: []
  },
  setInitialData,
  onSubmit,
  locations = []
}) => {
  const [course, setCourse] = useState(initialData);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (setInitialData) {
      setInitialData(course);
    }
  }, [course, setInitialData]);

  // Manejar cambios en los campos principales
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value
    });
  };

  // Manejar la subida de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...course.images];
      
      files.forEach(file => {
        // En un entorno real, aquí subirías el archivo a tu servidor o almacenamiento en la nube
        // Por ahora, solo creamos URLs temporales para las vistas previas
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            url: reader.result,
            file: file
          });
          
          setCourse({
            ...course,
            images: newImages
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Eliminar una imagen
  const removeImage = (index) => {
    const updatedImages = [...course.images];
    updatedImages.splice(index, 1);
    
    setCourse({
      ...course,
      images: updatedImages
    });
  };

  // Botón para abrir el selector de archivos
  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  // Crear el curso
  const handleCreateCourse = () => {
    if (onSubmit) {
      onSubmit(course);
    }
  };

  return (
    <div className={styles.formContainer}>
    {/* Primera fila: Título */}
    <div className={styles.formGroup}>
        <label className={styles.label}>Titulo del curso:</label>
        <input
          type="text"
          name="title"
          className={styles.input}
          value={course.title}
          onChange={handleInputChange}
          placeholder="Título de la actividad"
        />
    </div>

    {/* Segunda fila: fecha y precio */}
    <div className={styles.formRow}>
      <div className={styles.formGroup + ' ' + styles.width47percentage}>
      <label className={styles.label}>Fecha inicio - fin:</label>
      <div className={styles.formRow}>
        <input
            type="date"
            name="start_date"
            className={styles.input + ' ' + styles.width47percentage}
            value={course.start_date}
            onChange={handleInputChange}
            placeholder="Fecha de inicio"
        />
        <input
            type="date"
            name="end_date"
            className={styles.input + ' ' + styles.width47percentage}
            value={course.end_date}
            onChange={handleInputChange}
            placeholder="Fecha de fin"
        />
      </div>
      </div>
      <div className={styles.formGroup + ' ' + styles.width47percentage}>
      <label className={styles.label}> Precio:</label>
      <input
          type="text"
          name="price"
          className={styles.input}
          value={course.price}
          onChange={handleInputChange}
          placeholder="Precio"
      />
      </div>
    </div>


    {/* Tercera fila: Mensaje adicional Ubicación */}
    <div className={styles.formRow}>
    <div className={styles.formGroup + ' ' + styles.width47percentage}>
        <label className={styles.label}>Mensaje Adicional: </label>
        <input
            type="text"
            name="message"
            className={styles.input}
            value={course.message}
            onChange={handleInputChange}
            placeholder="Mensaje adicional"
        />
    </div>

    <div className={styles.formGroup + ' ' + styles.width47percentage}>
        <label className={styles.label}>Ubicación:</label>
        <select
            name="id_ubicacion"
            className={styles.input}
            value={course.id_ubicacion}
            onChange={handleInputChange}
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
        {course.images.length > 0 ? (
          course.images.map((image, index) => (
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

    {/* Sexta fila: Descripción detallada*/}
    <div className={styles.formGroup}>
        <label className={styles.label}>Descripción detallada:</label>
        <textarea
            name="description"
            className={styles.textarea}
            value={course.description}
            onChange={handleInputChange}
            placeholder="Descripción detallada de la actividad"
        />
    </div>

    {/* Botón de crear */}
    <div className={styles.formFooter}>
      <button 
        type="button" 
        className={styles.createButton}
        onClick={handleCreateCourse}
      >
        Crear actividad
      </button>
    </div>
  </div> 
  );
};

export default CourseForm;