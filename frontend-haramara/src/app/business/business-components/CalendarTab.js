'use client';

import React, { useState } from 'react';
import ShiftForm from './ShiftForm';
import WeekCalendar from './WeekCalendar';

const CalendarTab = ({ 
  activityId,
  initialShifts = [] 
}) => {
  const [shifts, setShifts] = useState(initialShifts);
  const [newShift, setNewShift] = useState({
    day: 'Lunes',
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    availableSlots: '',
    id_activity: activityId
  });
  
  // Calcular fechas para el calendario
  const calcDates = () => {
    if (shifts.length > 0) {
      // Usar las fechas de los turnos existentes
      const startDates = shifts.map(s => new Date(s.startDate));
      const endDates = shifts.map(s => new Date(s.endDate));
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

  const handleNewShiftChange = (updatedShift) => {
    setNewShift(updatedShift);
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
    
    setShifts([...shifts, newShiftWithId]);
    
    // Resetear el formulario
    setNewShift({
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
    if (window.confirm('¿Estás seguro de que deseas eliminar este turno?')) {
      setShifts(shifts.filter(shift => shift.id !== shiftId));
    }
  };

  return (
    <>
      <ShiftForm 
        initialData={newShift}
        setInitialData={handleNewShiftChange}
        onSubmit={handleAddShift}
      />
      <br style={{height: '20px'}}></br>
      <WeekCalendar 
        shifts={shifts} 
        onDeleteShift={handleDeleteShift} 
        dates={calcDates()}
      />
    </>
  );
};

export default CalendarTab;