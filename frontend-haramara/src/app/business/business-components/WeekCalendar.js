'use client';

import React from 'react';
import styles from './WeekCalendar.module.css';

const WeekCalendar = ({
  shifts = [],
  onDeleteShift,
  dates = {
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 6))
  }
}) => {
  const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Formatea la fecha para mostrarla
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    return `${day} ${month < 10 ? '0' + month : month}`;
  };

  // Genera las fechas para la semana
  const getDates = () => {
    const result = [];
    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    
    // Si es un rango corto (menos de 7 días), mostramos los días específicos
    if ((end - start) / (1000 * 60 * 60 * 24) < 7) {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        result.push(new Date(d));
      }
    } else {
      // Si es un rango largo, mostramos una semana representativa
      for (let i = 0; i < 7; i++) {
        result.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
      }
    }
    
    return result;
  };
  
  const calendarDates = getDates();
  
  return (
    <div className={styles.weekCalendar}>
      <div className={styles.calendarHeader}>
        {weekdays.map((day, index) => (
          <div key={day} className={styles.calendarHeaderCell}>
            <div className={styles.dayName}>{day}</div>
            <div className={styles.dayDate}>
              {calendarDates[index] ? formatDate(calendarDates[index]) : ''}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.calendarBody}>
        {weekdays.map((day, index) => (
          <div key={day} className={styles.calendarColumn}>
            {shifts
              .filter(shift => shift.day === day)
              .map(shift => (
                <div key={shift.id} className={styles.calendarShift}>
                  <div className={styles.shiftTime}>
                    {shift.startTime} - {shift.endTime}
                  </div>
                  <div className={styles.shiftSlots}>
                    {shift.availableSlots} cupos disponibles
                  </div>
                  {onDeleteShift && (
                    <button 
                      className={styles.deleteShiftButton}
                      onClick={() => onDeleteShift(shift.id)}
                      title="Eliminar turno"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;