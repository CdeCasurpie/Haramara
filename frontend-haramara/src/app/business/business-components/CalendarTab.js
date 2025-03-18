'use client';

import React, { useState } from 'react';
import ShiftForm from './ShiftForm';
import WeekCalendar from './WeekCalendar';

const CalendarTab = ({ 
  activityId,
  activityShifts,
  setActivityShifts,
  initialCurrentShift = {
    day: 'Lunes',
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    availableSlots: '',
    id_activity: ''
  }
}) => {
  // Estado solo para el turno que se está editando actualmente
  const [currentShift, setCurrentShift] = useState({
    ...initialCurrentShift,
    id_activity: activityId || initialCurrentShift.id_activity
  });
  
  // Calcular fechas para el calendario
  const calcDates = () => {
    if (activityShifts.length > 0) {
      // Usar las fechas de los turnos existentes
      const startDates = activityShifts.map(s => new Date(s.startDate));
      const endDates = activityShifts.map(s => new Date(s.endDate));
      return {
        startDate: new Date(Math.min(...startDates)),
        endDate: new Date(Math.max(...endDates))
      };
    } else {
      // Fechas por defecto (semana actual)
      const today = new Date();
      const endOfWeek = new Date();
      endOfWeek.setDate(today.getDate() + 6);
      return {
        startDate: today,
        endDate: endOfWeek
      };
    }
  };

  const handleAddShift = (shiftData) => {
    // Validación básica
    if (!shiftData.startTime || !shiftData.endTime || !shiftData.startDate || !shiftData.endDate) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }
    
    // Agregar el nuevo turno
    const newShiftWithId = {
      ...shiftData,
      id: Date.now() // Usar timestamp como ID temporal
    };
    
    // Actualizar el estado de turnos que viene desde fuera
    setActivityShifts([...activityShifts, newShiftWithId]);
    
    // Resetear el formulario
    setCurrentShift({
      day: 'Lunes',
      startTime: '',
      endTime: '',
      startDate: '',
      endDate: '',
      availableSlots: '',
      id_activity: activityId
    });
  };

  const handleDeleteShift = (shiftId) => {
    if (typeof window !== "undefined") {
      if (window.confirm('¿Estás seguro de que deseas eliminar este turno?')) {
        setActivityShifts(activityShifts.filter(shift => shift.id !== shiftId));
      }
    }
  };

  return (
    <>
      <ShiftForm 
        activityShift={currentShift}
        setActivityShift={setCurrentShift}
        onSubmit={handleAddShift}
      />
      <br style={{height: '20px'}}></br>
      <WeekCalendar 
        shifts={activityShifts} 
        onDeleteShift={handleDeleteShift} 
        dates={calcDates()}
      />
    </>
  );
};

export default CalendarTab;