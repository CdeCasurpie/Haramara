'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './CourseForm.module.css';
import LocationField from './LocationField';
import API_BASE_URL from '@/config';

const CourseForm = ({
  courseData,
  setCourseData,
  onSubmit,
  state,
  setState,
  fileImages,
  setFileImages,
  imagesDeleted,
  setImagesDeleted
}) => {
  const fileInputRef = useRef(null);
  const [countOldImages, setCountOldImages] = useState( courseData?.images?.length || 0);

  useEffect(() => {
    if (state === "normal") {
      setState("creating");
    }
  }, [state, setState]);

  // Manejar cambios en los campos principales
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value || ""
    });
  };

  // Manejar la selección de ubicación
  const handleLocationSelect = (location) => {
    setCourseData({
      ...courseData,
      location: location || ""
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Guardar los archivos directamente como un array en fileImages
    setFileImages((prev) => [...prev, ...files]);

    // Generar URLs para previsualización sin perder las imágenes del backend
    setCourseData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...files.map(file => URL.createObjectURL(file))]
    }));
};


  // Eliminar una imagen
  const removeImage = (index) => {
    console.log("old images: ", countOldImages);
    setImagesDeleted((prev) => {
      if (index < countOldImages) {
        return [...prev, courseData.images[index]];
      }
      return prev;
    });
  
    console.log(">>>", index, countOldImages);
    if (index < countOldImages) {
      console.log("bubu")
      setCountOldImages((prev) => prev - 1);
    } else {
      console.log("fileImages: ", fileImages);
      console.log("index: ", index);
      console.log("countOldImages: ", countOldImages);
      setFileImages((prev) => {
        const newImages = [...prev];
        console.log("newImages before: ", newImages);
        newImages.splice(index - countOldImages, 1);
        console.log("newImages after: ", newImages);
        return newImages;
      });
      console.log("fileImages after: ", fileImages);
    }
  
    // Actualizar `courseData.images`
    setCourseData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  
    console.log("Images deleted: ", imagesDeleted);
    console.log("Images a añadir: ", fileImages);
  };
  

  // Botón para abrir el selector de archivos
  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.formContainer}>
      {/* Primera fila: Título */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Titulo del curso:</label>
        <input
          type="text"
          name="titulo"
          className={styles.input}
          value={courseData?.titulo || ''}
          onChange={handleInputChange}
          placeholder="Título del curso"
        />
      </div>

      {/* Segunda fila: fecha y precio */}
      <div className={styles.formRow}>
        <div className={styles.formGroup + ' ' + styles.width62percentage}>
          <label className={styles.label}>Fecha inicio - fin:</label>
          <div className={styles.formRow}>
            <input
              type="date"
              name="start_date"
              className={styles.input + ' ' + styles.width47percentage}
              value={courseData?.start_date || ''}
              onChange={handleInputChange}
              placeholder="Fecha de inicio"
            />
            <input
              type="date"
              name="end_date"
              className={styles.input + ' ' + styles.width47percentage}
              value={courseData?.end_date || ''}
              onChange={handleInputChange}
              placeholder="Fecha de fin"
            />
          </div>
        </div>
        <div className={styles.formGroup + ' ' + styles.width30percentage}>
          <label className={styles.label}> Precio:</label>
          <input
            type="text"
            name="price"
            className={styles.input}
            value={courseData?.price || ''}
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
            name="adittional_info"
            className={styles.input}
            value={courseData?.adittional_info || ''}
            onChange={handleInputChange}
            placeholder="Nivel?"
          />
        </div>
        <div className={styles.formGroup + ' ' + styles.width47percentage}>
          <label className={styles.label}>Ubicación:</label>
          <LocationField
            initialLocation={courseData?.location || courseData?.ubicacion}
            onLocationSelect={handleLocationSelect}
            placeholder="Ubicación"
          />
        </div>
      </div>

      {/* Cuarta fila: min_age, vacancies */}
      <div className={styles.formRow}>
        <div className={styles.formGroup + ' ' + styles.width47percentage}>
          <label className={styles.label}>Edad mínima: </label>
          <input
            type="number"
            name="min_age"
            className={styles.input}
            value={courseData?.min_age || ''}
            onChange={handleInputChange}
            placeholder="10"
          />
        </div>
        <div className={styles.formGroup + ' ' + styles.width47percentage}>
          <label className={styles.label}>Vacantes iniciales: </label>
          <input
            type="number"
            name="vacancies"
            className={styles.input}
            value={courseData?.vacancies || ''}
            onChange={handleInputChange}
            placeholder="15"
          />
        </div>
      </div>

      {/* Quinta fila: Tags */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Tags: </label>
        <input
          type="text"
          name="tags"
          className={styles.input}
          value={courseData?.tags || ''}
          onChange={handleInputChange}
          placeholder="#nature#yoga#meditation"
        />
      </div>

      {/* sexta fila: Imágenes */}
      <div className={styles.formGroup}>
        <div className={styles.imagesHeader}>
          <label className={styles.label}>Imágenes del curso:</label>
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
          {courseData?.images && courseData.images.length > 0 ? (
            courseData.images.map((image, index) => (
              <div key={index} className={styles.imageThumbContainer}>
                <img 
                  src={image?.startsWith("blob:") ? image : `${API_BASE_URL}/${image}` || ''}
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

      {/* Séptima fila: Descripción detallada*/}
      <div className={styles.formGroup}>
        <label className={styles.label}>Descripción detallada:</label>
        <textarea
          name="description"
          className={styles.textarea}
          value={courseData?.description || ''}
          onChange={handleInputChange}
          placeholder="Descripción detallada del curso"
        />
      </div>
    </div> 
  );
};

export default CourseForm;