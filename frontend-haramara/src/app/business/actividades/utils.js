// Mocks para simular el backend
// =============================
// Estas funciones se pueden mover a un archivo separado más adelante

// Datos de ejemplo iniciales
const mockActivities = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    title: `Título de la actividad, en Familia ${index + 1}`,
    description: `Descripción de la actividad ${index + 1}. Esta actividad está diseñada para toda la familia.`,
    price_per_person: (Math.random() * 100).toFixed(2),
    min_age: Math.floor(Math.random() * 10) + 5,
    initial_vacancies: Math.floor(Math.random() * 30) + 10,
    location: { 
    id: index + 1, 
    name: `Ubicación ${index + 1}`,
    address: `Dirección ${index + 1}`, 
    lat: 20 + Math.random(), 
    lng: -100 + Math.random() 
    },
    tags: `familia,diversión,${index % 2 === 0 ? 'exterior' : 'interior'}`,
    characteristics: [
    { name: 'Duración', value: `${Math.floor(Math.random() * 4) + 1} horas` },
    { name: 'Dificultad', value: ['Fácil', 'Moderada', 'Difícil'][Math.floor(Math.random() * 3)] }
    ],
    images: [],
    rating: Math.floor(Math.random() * 5) + 1
}));

// Datos de ejemplo de turnos
const mockShifts = {};
mockActivities.forEach(activity => {
    // Generar 0-3 turnos de ejemplo para cada actividad
    const numShifts = Math.floor(Math.random() * 4);
    const shifts = [];
    
    for (let i = 0; i < numShifts; i++) {
    // Generar fechas aleatorias dentro de los próximos 30 días
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + Math.floor(Math.random() * 7)); // Próximos 7 días
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7 + Math.floor(Math.random() * 23)); // 1-3 semanas después
    
    // Formatear fechas a YYYY-MM-DD
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    shifts.push({
        id: Date.now() + i,
        day: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][Math.floor(Math.random() * 7)],
        startTime: `${10 + Math.floor(Math.random() * 8)}:00`,
        endTime: `${14 + Math.floor(Math.random() * 6)}:00`,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        availableSlots: Math.floor(Math.random() * 20) + 5,
        id_activity: activity.id
    });
    }
    
    mockShifts[activity.id] = shifts;
});

// Funciones mock para interactuar con el "backend"
// Simular un pequeño delay para imitar la latencia de red
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// Obtener todas las actividades
const fetchActivities = async () => {
    await mockDelay();
    return [...mockActivities];
};

// Obtener una actividad por su ID
const fetchActivityById = async (id) => {
    await mockDelay();
    const activity = mockActivities.find(a => a.id === id);
    if (!activity) throw new Error(`Actividad con ID ${id} no encontrada`);
    return { ...activity };
};

// Crear una nueva actividad
const createActivity = async (activityData) => {
    await mockDelay();
    const newId = Math.max(...mockActivities.map(a => a.id), 0) + 1;
    const newActivity = {
    ...activityData,
    id: newId,
    rating: Math.floor(Math.random() * 5) + 1
    };
    mockActivities.push(newActivity);
    return { ...newActivity };
};

// Actualizar una actividad existente
const updateActivity = async (id, activityData) => {
    await mockDelay();
    const index = mockActivities.findIndex(a => a.id === id);
    if (index === -1) throw new Error(`Actividad con ID ${id} no encontrada`);
    
    const updatedActivity = {
    ...mockActivities[index],
    ...activityData,
    id // Asegurarse de que el ID no cambie
    };
    mockActivities[index] = updatedActivity;
    return { ...updatedActivity };
};

// Eliminar una actividad
const deleteActivity = async (id) => {
    await mockDelay();
    const index = mockActivities.findIndex(a => a.id === id);
    if (index === -1) throw new Error(`Actividad con ID ${id} no encontrada`);
    
    mockActivities.splice(index, 1);
    return { success: true };
};

// Obtener los turnos de una actividad
const fetchShiftsByActivityId = async (activityId) => {
    await mockDelay();
    return mockShifts[activityId] ? [...mockShifts[activityId]] : [];
};

// Crear nuevos turnos para una actividad
// Esta función recibe una lista de turnos y solo crea los que no tienen ID
// Los turnos existentes no se modifican ni eliminan
const createShifts = async (activityId, shiftsData) => {
    await mockDelay();
    
    if (!mockShifts[activityId]) {
        mockShifts[activityId] = [];
    }
    
    const createdShifts = [];
    
    for (const shiftData of shiftsData) {
        // Si el turno no tiene ID, lo consideramos un turno nuevo para crear
        if (!shiftData.id) {
            const newShift = {
                ...shiftData,
                id: Date.now() + Math.floor(Math.random() * 1000), // Generar ID único
                id_activity: activityId
            };
            
            mockShifts[activityId].push(newShift);
            createdShifts.push(newShift);
        }
    }
    
    return createdShifts;
};


// Fin de los mocks para el backend
// ================================


export { 
    fetchActivities, 
    fetchActivityById, 
    createActivity, 
    updateActivity, 
    deleteActivity, 
    fetchShiftsByActivityId, 
    createShifts
};