'use client';

import React, { useState, useEffect } from 'react';
import styles from './MisDatos.module.css';
import LocationField from '../business-components/LocationField';

export default function MisDatos() {
  const [formData, setFormData] = useState({
    companyName: 'HARAMARA BUSINESS',
    description: '# Sobre nosotros\n\nSomos una empresa dedicada a actividades acuáticas en la costa del Pacífico mexicano. Ofrecemos experiencias únicas en:\n\n- Kayak\n- Buceo\n- Paddleboard\n- Surf\n\n## Nuestra misión\n\nConectar a las personas con el mar de manera segura y responsable.',
    phone: '+52 123 456 7890',
    email: 'info@haramarabusiness.com',
    website: 'www.haramarabusiness.com',
    address: 'Playa Los Muertos 123, Sayulita, Nayarit, México',
    facebook: '',
    instagram: ''
  });
  
  const [originalData, setOriginalData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  useEffect(() => {
    setOriginalData(formData);
  }, []);
  
  // Chequea si los datos han cambiado
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
    setIsChanged(hasChanged);
  }, [formData, originalData]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = () => {
    setOriginalData(formData);
    setIsChanged(false);
    alert('Datos guardados correctamente');
  };
  
  const handleCancel = () => {
    setFormData(originalData);
    setIsChanged(false);
  };
  
  // Markdown render format
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
  
  return (
    <div className={styles.fullContainer}>
      <div className={styles.fullCard}>
        <div className={styles.twoColumn}>
          {/* Left Column - Profile and Description */}
          <div className={styles.leftColumn}>
            {/* Cover Image */}
            <div className={styles.coverImageContainer}>
                {coverImage && (
              <img 
                src={coverImage} 
                alt="Portada" 
                className={styles.coverImage} 
              />)}
              <button className={styles.imageButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>
            
            {/* Profile Section y Profile Image */}
            <div className={styles.profileSection}>
              <div className={styles.profileInfo}>
                <div className={styles.profileImageContainer}>
                  <img 
                    src={profileImage ? profileImage : '/images/general/profile_default.svg'}
                    alt="Logo" 
                    className={styles.profileImage} 
                  />
                  <button className={styles.profileImageButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </button>
                </div>
                <div className={styles.companyName}>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={styles.companyNameInput}
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
                <div className={styles.formField}>
                  <label className={styles.label}>
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                
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
                
                <div className={styles.formField}>
                  <label className={styles.label}>
                    Sitio Web
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.label}>
                    Dirección
                  </label>
                  <LocationField 
                    value={formData.address}
                    onLocationSelect={(value) => {
                      setFormData({
                        ...formData,
                        address: value
                      });
                    }}
                  />
                </div>
                
                {/* Social Media Links */}
                <div className={styles.socialMedia}>
                  <div className={styles.socialGrid}>
                    <div className={styles.formField}>
                      <label className={styles.label}>
                        Facebook
                      </label>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        placeholder="URL de Facebook"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.label}>
                        Instagram
                      </label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="URL de Instagram"
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                {isChanged && (
                  <button 
                    onClick={handleCancel}
                    className={`${styles.button} ${styles.buttonCancel}`}
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  onClick={handleSave}
                  disabled={!isChanged}
                  className={`${styles.button} ${styles.buttonSuccess} ${!isChanged ? styles.buttonDisabled : ''}`}
                >
                  <span className={styles.iconWrapper}>
                    <svg className={styles.iconMargin} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Guardar Cambios
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