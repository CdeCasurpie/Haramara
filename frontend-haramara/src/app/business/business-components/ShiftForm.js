'use client';

import React from 'react';
import styles from './ActivityForm.module.css';

const ShiftForm = ({
  activityShift,
  setActivityShift,
  onSubmit,
}) => {
  // Manejar cambios en los campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActivityShift({
      ...activityShift,
      [name]: value
    });
  };

  // Crear el turno
  const handleCreateShift = () => {
    if (onSubmit) {
      onSubmit(activityShift);
    }
  };

  const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className={styles.formContainer}>
      {/* Primera fila: Día de la semana */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Día de la semana:</label>
        <select
          name="day"
          className={styles.select}
          value={activityShift.day || 'Lunes'}
          onChange={handleInputChange}
        >
          {weekdays.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {/* Segunda fila: Hora inicio y fin */}
      <div className={styles.formRow}>
        <div className={styles.formGroup + ' ' + styles.width47percentage}>
          <label className={styles.label}>Hora de inicio:</label>
          <input
            type="time"
            name="startTime"
            className={styles.input}
            value={activityShift.startTime || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className={styles.formGroup + ' ' + styles.width47percentage}>
          <label className={styles.label}>Hora de fin:</label>
          <input
            type="time"
            name="endTime"
            className={styles.input}
            value={activityShift.endTime || ''}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Tercera fila: Fecha inicio y fin */}
      <div className={styles.formRow}>
        <div className={styles.formGroup + ' ' + styles.width47percentage}>
          <label className={styles.label}>Fecha de inicio:</label>
          <input
            type="date"
            name="startDate"
            className={styles.input}
            value={activityShift.startDate || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className={styles.formGroup + ' ' + styles.width47percentage}>
          <label className={styles.label}>Fecha de fin:</label>
          <input
            type="date"
            name="endDate"
            className={styles.input}
            value={activityShift.endDate || ''}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Cuarta fila: Cupos disponibles */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Cupos disponibles:</label>
        <div className={styles.formRow}>
          <input
            type="number"
            name="availableSlots"
            className={`${styles.input} ${styles.hideSpinners}`}
            value={activityShift.availableSlots || ''}
            onChange={handleInputChange}
            placeholder="5"
            min="0"
            required
          />
          <button 
            type="button" 
            className={styles.createButton}
            onClick={handleCreateShift}
          >
            Añadir Turno
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default ShiftForm;