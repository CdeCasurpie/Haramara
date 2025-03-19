'use client';

import React, { useState, useEffect } from 'react';
import styles from './MisDatos.module.css';
import { fetchCompanyData, updateCompanyData, updateCompanyImages } from './utils';
import API_BASE_URL from '@/config';

export default function MisDatos() {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Solo para cambios de contraseña
    url_image_logo: '',
    url_image_portada: '',
    name_representative: '',
    last_name_representative: '',
    is_safe: false,
    has_languages: false,
    description: '', // Campo de descripción (a añadir en BD)
    // Datos de ubicación
    location: {
      address: '',
      country: '',
      comunity: '',
      province: '',
      postal_code: ''
    }
  });
  
  const [originalData, setOriginalData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Cargar datos de la empresa al montar el componente
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCompanyData();
        setFormData(data);
        setOriginalData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    loadCompanyData();
  }, []);
  
  // Chequea si los datos han cambiado
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
    setIsChanged(hasChanged);
  }, [formData, originalData]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Para campos anidados como location.address
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      // Para campos simples
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      // Crear una URL para previsualizarlo
      const fileURL = URL.createObjectURL(file);
      setFormData({
        ...formData,
        url_image_logo: fileURL
      });
    }
  };
  
  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      // Crear una URL para previsualizarlo
      const fileURL = URL.createObjectURL(file);
      setFormData({
        ...formData,
        url_image_portada: fileURL
      });
    }
  };
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Primero actualizar las imágenes si hay cambios
      if (logoFile || coverFile) {
        await updateCompanyImages(logoFile, coverFile);
      }
      
      // Luego actualizar los datos del formulario
      await updateCompanyData(formData);
      
      // Actualizar el estado
      setOriginalData(formData);
      setIsChanged(false);
      setLogoFile(null);
      setCoverFile(null);

      alert('Datos guardados correctamente');
      
    } catch (err) {
      alert(`Error al guardar los datos: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    setFormData(originalData);
    setIsChanged(false);
    setLogoFile(null);
    setCoverFile(null);
    
    // Si había URLs temporales creadas, limpiarlas
    if (logoFile) URL.revokeObjectURL(formData.url_image_logo);
    if (coverFile) URL.revokeObjectURL(formData.url_image_portada);
  };
  
  // Markdown render format para la descripción
  const renderFormattedText = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className={styles.h1}>{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={i} className={styles.h2}>{line.substring(3)}</h2>;
      } else if (line.startsWith('- ')) {
        return <li key={i} className={styles.listItem}>{line.substring(2)}</li>;
      } else if (line === '') {
        return <br key={i} />;
      } else {
        return <p key={i} className={styles.paragraph}>{line}</p>;
      }
    });
  };

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }
  
  return (
    <div className={styles.fullContainer}>
      <div className={styles.fullCard}>
        
        <div className={styles.twoColumn}>
          {/* Left Column - Profile and Description */}
          <div className={styles.leftColumn}>
            {/* Cover Image */}
            <div className={styles.coverImageContainer}>
              {formData.url_image_portada && (
                <img 
                    src={formData.url_image_portada?.startsWith("blob:") 
                    ? formData.url_image_portada
                    : API_BASE_URL + formData.url_image_portada || ''}
                  
                  alt="Portada" 
                  className={styles.coverImage} 
                />
              )}
              <label className={styles.imageButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleCoverChange}
                />
              </label>
            </div>
            
            {/* Profile Section y Profile Image */}
            <div className={styles.profileSection}>
              <div className={styles.profileInfo}>
                <div className={styles.profileImageContainer}>
                  <img 
                    src={formData.url_image_logo?.startsWith("blob:") 
                      ? formData.url_image_logo 
                      : API_BASE_URL + formData.url_image_logo || '/images/general/profile_default.svg'}
                    alt="Logo" 
                    className={styles.profileImage} 
                  />
                  <label className={styles.profileImageButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
                <div className={styles.companyName}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.companyNameInput}
                    placeholder="Nombre de la empresa"
                  />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className={styles.descriptionSection}>
              <label className={styles.label}>
                Descripción
              </label>
              {!previewMode ? (
                <div className={styles.textareaContainer}>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={styles.textareaFull}
                    placeholder="Agrega una descripción de tu empresa..."
                  />
                  <div className={styles.helpText}>
                    <svg className={styles.helpIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Utiliza # para títulos, ## para subtítulos y - para listas
                  </div>
                </div>
              ) : (
                <div className={styles.previewBox}>
                  {renderFormattedText(formData.description)}   
                </div>
              )}
              <div className={styles.previewButtonContainer}>
                <button 
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  {previewMode ? 'Editar' : 'Vista Previa'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Form Fields */}
          <div className={styles.rightColumn}>
            <div className={styles.formContainer}>
              <div className={styles.formRows}>
                {/* Datos principales */}
                <div className={styles.formField}>
                  <label className={styles.label}>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                
                {/* Datos del representante */}
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.label}>
                      Nombre del Representante
                    </label>
                    <input
                      type="text"
                      name="name_representative"
                      value={formData.name_representative}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  
                  <div className={styles.formField}>
                    <label className={styles.label}>
                      Apellido del Representante
                    </label>
                    <input
                      type="text"
                      name="last_name_representative"
                      value={formData.last_name_representative}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>
                
                {/* Contraseña (para cambios) */}
                <div className={styles.formField}>
                  <label className={styles.label}>
                    Cambiar Contraseña (dejar en blanco para mantener la actual)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Nueva contraseña"
                  />
                </div>
                
                {/* Checkboxes */}
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                  <label className={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        name="is_safe"
                        checked={formData.is_safe}
                        onChange={handleInputChange}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxToggle}></span>
                      <span className={styles.checkboxLabel}>Es Seguro</span>
                    </label>
                  </div>
                  
                  <div className={styles.formField}>
                    <label className={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        name="has_languages"
                        checked={formData.has_languages}
                        onChange={handleInputChange}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxToggle}></span>
                      <span className={styles.checkboxLabel}>Tiene Idiomas Adicionales</span>
                    </label>
                  </div>
                </div>
                
                {/* Dirección */}
                <div className={styles.formField}>
                  <label className={styles.label}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.label}>
                      País
                    </label>
                    <input
                      type="text"
                      name="location.country"
                      value={formData.location.country}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  
                  <div className={styles.formField}>
                    <label className={styles.label}>
                      Comunidad
                    </label>
                    <input
                      type="text"
                      name="location.comunity"
                      value={formData.location.comunity}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.label}>
                      Provincia
                    </label>
                    <input
                      type="text"
                      name="location.province"
                      value={formData.location.province}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  
                  <div className={styles.formField}>
                    <label className={styles.label}>
                      Código Postal
                    </label>
                    <input
                      type="text"
                      name="location.postal_code"
                      value={formData.location.postal_code}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                {isChanged && (
                  <button 
                    onClick={handleCancel}
                    className={`${styles.button} ${styles.buttonCancel}`}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                )}  
                <button 
                  onClick={handleSave}
                  disabled={!isChanged || isLoading}
                  className={`${styles.button} ${styles.buttonSuccess} ${(!isChanged || isLoading) ? styles.buttonDisabled : ''}`}
                >
                  <span className={styles.iconWrapper}>
                    {isLoading ? (
                      <svg className={styles.iconMargin} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    ) : (
                      <svg className={styles.iconMargin} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                    )}
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}