// API Service para comunicación con el backend
// =======================================

import API_BASE_URL from "@/config";

// Función auxiliar para manejar errores y respuestas
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  
  return data;
};


// Obtener todas las actividades
const fetchActivities = async () => {
  
  const response = await fetch(`${API_BASE_URL}/company/activities`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  
  const data = await handleResponse(response);
  return data.activities || [];
};

// Obtener una actividad por su ID
const fetchActivityById = async (id) => {
  
  const response = await fetch(`${API_BASE_URL}/company/activities/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  
  const data = await handleResponse(response);
  return data.activity;
};

// Crear una nueva actividad
const createActivity = async (activityData) => {
  
  // Adaptar datos al formato que espera el backend
  const requestData = {
    title: activityData.title,
    description: activityData.description,
    price_per_person: activityData.price_per_person,
    min_age: activityData.min_age,
    initial_vacancies: activityData.initial_vacancies,
    characteristics: activityData.characteristics || [],
    tags: activityData.tags,
    location: activityData.location,
    images: activityData.images || []
  };
  
  const response = await fetch(`${API_BASE_URL}/company/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(requestData)
  });
  
  const data = await handleResponse(response);
  
  // Si se creó correctamente, obtener la actividad creada
  if (data.success && data.activity_id) {
    return await fetchActivityById(data.activity_id);
  }
  
  throw new Error('Error al crear la actividad');
};

// Actualizar una actividad existente
const updateActivity = async (id, activityData) => {
  
  // Adaptar datos al formato que espera el backend
  const requestData = {};
  
  if (activityData.title !== undefined) requestData.title = activityData.title;
  if (activityData.location !== undefined) requestData.location = activityData.location;
  if (activityData.description !== undefined) requestData.description = activityData.description;
  if (activityData.price_per_person !== undefined) requestData.price_per_person = activityData.price_per_person;
  if (activityData.min_age !== undefined) requestData.min_age = activityData.min_age;
  if (activityData.initial_vacancies !== undefined) requestData.initial_vacancies = activityData.initial_vacancies;
  if (activityData.characteristics !== undefined) requestData.features = activityData.characteristics;
  if (activityData.tags !== undefined) requestData.tags = activityData.tags;
  if (activityData.location !== undefined) requestData.location = activityData.location;
  if (activityData.images !== undefined) requestData.images = activityData.images;
  
  const response = await fetch(`${API_BASE_URL}/company/activities/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(requestData)
  });
  
  const data = await handleResponse(response);
  
  // Si se actualizó correctamente, obtener la actividad actualizada
  if (data.success) {
    return await fetchActivityById(id);
  }
  
  throw new Error('Error al actualizar la actividad');
};

// Eliminar una actividad
const deleteActivity = async (id) => {
  
  const response = await fetch(`${API_BASE_URL}/company/activities/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  
  return handleResponse(response);
};

// Obtener los turnos de una actividad
const fetchShiftsByActivityId = async (activityId) => {

  const response = await fetch(`${API_BASE_URL}/company/activities/${activityId}/shifts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  
  const data = await handleResponse(response);
  return data.shifts || [];
};

// Crear nuevos turnos para una actividad
const createShifts = async (activityId, shiftsData) => {

  // Preparar datos para el envío - solo enviar los turnos sin ID (nuevos)
  const newShifts = shiftsData.filter(shift => !shift.id);
  
  // Si no hay turnos nuevos, no hacer la petición
  if (newShifts.length === 0) {
    return [];
  }
  
  // Adaptar formato de acuerdo con lo que espera el backend
  const formattedShifts = newShifts.map(shift => ({
    day: shift.day,
    startTime: shift.startTime,
    endTime: shift.endTime,
    startDate: shift.startDate,
    endDate: shift.endDate,
    availableSlots: shift.availableSlots || null
  }));
  
  const response = await fetch(`${API_BASE_URL}/company/activities/${activityId}/shifts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ shifts: formattedShifts })
  });
  
  const data = await handleResponse(response);
  
  // Si se crearon correctamente, obtener todos los turnos actualizados
  if (data.success) {
    return await fetchShiftsByActivityId(activityId);
  }
  
  throw new Error('Error al crear turnos');
};

export { 
  fetchActivities, 
  fetchActivityById, 
  createActivity, 
  updateActivity, 
  deleteActivity, 
  fetchShiftsByActivityId, 
  createShifts
};