// Función para generar URL de imagen aleatoria con Picsum Photos
const generatePicsumUrl = (seed, width = 600, height = 400) => {
  // Aseguramos que el seed sea una cadena válida para URL
  const safeSeed = encodeURIComponent(String(seed).replace(/[^a-zA-Z0-9-_]/g, ''));
  return `https://picsum.photos/seed/${safeSeed}/${width}/${height}`;
};

// Mock de datos detallados de cursos
const coursesDetailMock = {
  "1": {
    "id": 1,
    "titulo": "Curso de Vela",
    "price": 250.00,
    "start_date": "15 de Mayo 2025",
    "end_date": "30 de Junio 2025",
    "min_age": 16,
    "level": "Principiante",
    "ubicacion": "Puerto de Mazarrón, Murcia",
    "coordinates": { lat: 37.561, lng: -1.261 },
    "rating": 4.7,
    "vacancies": 20,
    "images": [
      generatePicsumUrl("vela-course-1"), 
      generatePicsumUrl("vela-course-2"),
      generatePicsumUrl("vela-course-3"),
      generatePicsumUrl("vela-course-4")
    ],
    "fullDescription": `
      <h3>Descripción del curso</h3>
      <p>Aprende los fundamentos de la navegación a vela en este curso completo para principiantes. Durante las sesiones, adquirirás las habilidades básicas necesarias para tripular una embarcación de vela ligera.</p>
      
      <h3>¿Qué aprenderás?</h3>
      <ul>
        <li>Nomenclatura náutica básica</li>
        <li>Técnicas de aparejado y desaparejado</li>
        <li>Maniobras básicas: viradas, trasluchadas</li>
        <li>Seguridad en el mar</li>
        <li>Navegación con diferentes condiciones de viento</li>
      </ul>
      
      <h3>Material necesario</h3>
      <p>Todo el material técnico está incluido en el precio del curso. Los participantes deben traer:</p>
      <ul>
        <li>Ropa cómoda y que se pueda mojar</li>
        <li>Zapatillas de agua o calzado que se pueda mojar</li>
        <li>Gorra y gafas de sol</li>
        <li>Protector solar</li>
        <li>Toalla y muda de ropa seca</li>
      </ul>
    `,
    "turnos": [
      {
        "id": 1,
        "startTime": "10:00",
        "endTime": "13:00",
        "days": { "L": true, "M": false, "X": true, "J": false, "V": true, "S": false, "D": false },
        "freeVacancies": 8
      },
      {
        "id": 2,
        "startTime": "16:00",
        "endTime": "19:00",
        "days": { "L": false, "M": true, "X": false, "J": true, "V": false, "S": true, "D": false },
        "freeVacancies": 5
      },
      {
        "id": 3,
        "startTime": "09:00",
        "endTime": "12:00",
        "days": { "L": false, "M": false, "X": false, "J": false, "V": false, "S": false, "D": true },
        "freeVacancies": 0
      }
    ],
    "caracteristicas": [
      { "nombre": "Duración", "valor": "6 semanas" },
      { "nombre": "Incluye material", "valor": "Sí" },
      { "nombre": "Certificación", "valor": "Federación de Vela" },
      { "nombre": "Instructor", "valor": "Profesional titulado" }
    ]
  },
  "2": {
    "id": 2,
    "titulo": "Curso de Buceo Open Water",
    "price": 350.00,
    "start_date": "10 de Julio 2025",
    "end_date": "25 de Julio 2025",
    "min_age": 18,
    "level": "Principiante",
    "ubicacion": "Cabo de Palos, Cartagena",
    "coordinates": { lat: 37.629, lng: -0.692 },
    "rating": 4.9,
    "vacancies": 12,
    "images": [
      generatePicsumUrl("buceo-course-1"), 
      generatePicsumUrl("buceo-course-2"),
      generatePicsumUrl("buceo-course-3")
    ],
    "fullDescription": `
      <h3>Descripción del curso</h3>
      <p>Curso completo para obtener la titulación Open Water Diver, la certificación de buceo más reconocida a nivel mundial. Te permitirá bucear hasta 18 metros de profundidad en cualquier lugar del mundo.</p>
      
      <h3>¿Qué aprenderás?</h3>
      <ul>
        <li>Principios físicos del buceo</li>
        <li>Uso del equipo de buceo</li>
        <li>Técnicas de respiración subacuática</li>
        <li>Procedimientos de seguridad</li>
        <li>Planificación de inmersiones</li>
        <li>Flotabilidad y navegación subacuática</li>
      </ul>
      
      <h3>El curso incluye</h3>
      <ul>
        <li>Material didáctico</li>
        <li>4 sesiones teóricas</li>
        <li>4 prácticas en aguas confinadas</li>
        <li>4 inmersiones en mar abierto</li>
        <li>Alquiler de equipo completo</li>
        <li>Tramitación de la certificación internacional</li>
      </ul>
    `,
    "turnos": [
      {
        "id": 4,
        "startTime": "09:00",
        "endTime": "14:00",
        "days": { "L": true, "M": true, "X": false, "J": false, "V": false, "S": false, "D": false },
        "freeVacancies": 4
      },
      {
        "id": 5,
        "startTime": "15:00",
        "endTime": "20:00",
        "days": { "L": false, "M": false, "X": true, "J": true, "V": true, "S": false, "D": false },
        "freeVacancies": 6
      }
    ],
    "caracteristicas": [
      { "nombre": "Duración", "valor": "2 semanas" },
      { "nombre": "Incluye material", "valor": "Sí" },
      { "nombre": "Certificación", "valor": "PADI/SSI" },
      { "nombre": "Nivel de dificultad", "valor": "Básico" }
    ]
  },
  "3": {
    "id": 3,
    "titulo": "Curso Avanzado de Windsurf",
    "price": 290.00,
    "start_date": "5 de Agosto 2025",
    "end_date": "20 de Agosto 2025",
    "min_age": 16,
    "level": "Intermedio",
    "ubicacion": "Los Alcázares, Mar Menor",
    "coordinates": { lat: 37.747, lng: -0.857 },
    "rating": 4.5,
    "vacancies": 8,
    "images": [
      generatePicsumUrl("windsurf-course-1"), 
      generatePicsumUrl("windsurf-course-2"),
      generatePicsumUrl("windsurf-course-3"),
      generatePicsumUrl("windsurf-course-4"),
      generatePicsumUrl("windsurf-course-5")
    ],
    "fullDescription": `
      <h3>Descripción del curso</h3>
      <p>Perfecciona tus habilidades en windsurf con este curso de nivel intermedio. Destinado a participantes que ya dominan los fundamentos básicos y quieren avanzar a técnicas más complejas.</p>
      
      <h3>Requisitos previos</h3>
      <p>Los participantes deben tener experiencia previa en windsurf y ser capaces de:</p>
      <ul>
        <li>Navegar en ceñida y través</li>
        <li>Realizar viradas básicas</li>
        <li>Utilizar el arnés correctamente</li>
      </ul>
      
      <h3>¿Qué aprenderás?</h3>
      <ul>
        <li>Técnicas avanzadas de navegación</li>
        <li>Navegación en condiciones de viento fuerte</li>
        <li>Planificación de rutas</li>
        <li>Técnicas de planeo y uso de footstraps</li>
        <li>Maniobras avanzadas: waterstart, power jibe</li>
      </ul>
      
      <h3>Material necesario</h3>
      <p>Se proporciona todo el material técnico, pero es recomendable traer:</p>
      <ul>
        <li>Traje de neopreno propio (si dispone)</li>
        <li>Escarpines</li>
        <li>Protector solar resistente al agua</li>
        <li>Gorra y gafas deportivas con sujeción</li>
      </ul>
    `,
    "turnos": [
      {
        "id": 6,
        "startTime": "10:30",
        "endTime": "13:30",
        "days": { "L": false, "M": true, "X": false, "J": true, "V": false, "S": false, "D": false },
        "freeVacancies": 3
      },
      {
        "id": 7,
        "startTime": "16:30",
        "endTime": "19:30",
        "days": { "L": true, "M": false, "X": true, "V": false, "S": true, "D": false },
        "freeVacancies": 0
      }
    ],
    "caracteristicas": [
      { "nombre": "Duración", "valor": "15 días" },
      { "nombre": "Nivel", "valor": "Intermedio" },
      { "nombre": "Ratio instructor/alumnos", "valor": "1:4" },
      { "nombre": "Edad mínima", "valor": "16 años" }
    ]
  }
};

// Función simulada para recuperar detalles de un curso por ID
export const fetchCourseDetail = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Convertir el ID a string para buscar en el objeto mock
      const courseId = String(id);
      if (coursesDetailMock[courseId]) {
        resolve({
          success: true,
          course: coursesDetailMock[courseId]
        });
      } else {
        // Si no existe el curso con ese ID, creamos uno dinámicamente basado en el ID
        const dynamicCourse = {
          "id": parseInt(id),
          "titulo": `Curso Náutico ${id}`,
          "price": 200 + (parseInt(id) * 25),
          "start_date": "1 de Junio 2025",
          "end_date": "30 de Junio 2025",
          "min_age": 12 + (parseInt(id) % 8),
          "level": ["Principiante", "Intermedio", "Avanzado"][parseInt(id) % 3],
          "ubicacion": "Costa de Murcia",
          "coordinates": { lat: 37.6 + (parseInt(id) * 0.01), lng: -0.9 - (parseInt(id) * 0.01) },
          "rating": 4.0 + ((parseInt(id) % 10) / 10),
          "vacancies": 5 + (parseInt(id) % 15),
          "images": [
            generatePicsumUrl(`course-${id}-1`),
            generatePicsumUrl(`course-${id}-2`),
            generatePicsumUrl(`course-${id}-3`)
          ],
          "fullDescription": `
            <h3>Descripción del Curso Náutico ${id}</h3>
            <p>Este es un curso completo donde aprenderás todas las habilidades necesarias para navegar con seguridad y confianza.</p>
            
            <h3>¿Qué incluye?</h3>
            <ul>
              <li>Formación teórica completa</li>
              <li>Prácticas en el mar</li>
              <li>Material didáctico</li>
              <li>Equipo necesario para las actividades</li>
              <li>Seguro de actividades</li>
            </ul>
            
            <h3>Material recomendado</h3>
            <ul>
              <li>Ropa cómoda y que se pueda mojar</li>
              <li>Protector solar</li>
              <li>Gorra y gafas de sol</li>
              <li>Toalla y muda de ropa seca</li>
            </ul>
          `,
          "turnos": [
            {
              "id": parseInt(id) * 10 + 1,
              "startTime": "09:00",
              "endTime": "12:00",
              "days": { 
                "L": Boolean(parseInt(id) % 2), 
                "M": Boolean((parseInt(id) + 1) % 2), 
                "X": Boolean(parseInt(id) % 3), 
                "J": Boolean((parseInt(id) + 1) % 3), 
                "V": Boolean(parseInt(id) % 2), 
                "S": Boolean((parseInt(id) + 1) % 4), 
                "D": false 
              },
              "freeVacancies": parseInt(id) % 10
            },
            {
              "id": parseInt(id) * 10 + 2,
              "startTime": "16:00",
              "endTime": "19:00",
              "days": { 
                "L": Boolean((parseInt(id) + 1) % 2), 
                "M": Boolean(parseInt(id) % 2), 
                "X": Boolean((parseInt(id) + 1) % 3), 
                "J": Boolean(parseInt(id) % 3), 
                "V": Boolean((parseInt(id) + 1) % 2), 
                "S": Boolean(parseInt(id) % 4), 
                "D": Boolean(parseInt(id) % 5)
              },
              "freeVacancies": (parseInt(id) + 3) % 10
            }
          ],
          "caracteristicas": [
            { "nombre": "Duración", "valor": `${parseInt(id) + 1} semanas` },
            { "nombre": "Incluye material", "valor": "Sí" },
            { "nombre": "Nivel", "valor": ["Básico", "Intermedio", "Avanzado"][parseInt(id) % 3] },
            { "nombre": "Certificación", "valor": "Federación Náutica" }
          ]
        };

        resolve({
          success: true,
          course: dynamicCourse
        });
      }
    }, 1000); // Simular un pequeño retraso de red
  });
};

// Simular la obtención de reseñas para un curso
export const fetchCourseReviews = async (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generar un número aleatorio de reseñas basado en el ID del curso
      const numReviews = 3 + (parseInt(courseId) % 5);
      const reviews = [];
      
      for (let i = 0; i < numReviews; i++) {
        reviews.push({
          id: parseInt(courseId) * 100 + i,
          userName: `Usuario ${i+1}`,
          rating: 3 + (Math.floor(Math.random() * 3)), // Calificación entre 3-5
          comment: `Esta es una reseña ${i+1} para el curso ${courseId}. La experiencia fue muy buena y el instructor explica muy bien.`,
          date: `${1 + i} de abril de 2025`
        });
      }

      resolve({
        success: true,
        reviews: reviews
      });
    }, 500);
  });
};

// Simular obtención de cursos relacionados
export const fetchRelatedCourses = async (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generar 4 cursos relacionados
      const relatedCourses = [];
      for (let i = 0; i < 4; i++) {
        // Usar IDs diferentes al curso actual
        const relatedId = ((parseInt(courseId) + i + 1) % 20) + 1;
        
        relatedCourses.push({
          "id": relatedId,
          "titulo": `Curso Relacionado ${relatedId}`,
          "price": 150 + (relatedId * 10),
          "start_date": "Mayo 2025",
          "end_date": "Junio 2025",
          "min_age": 14 + (relatedId % 6),
          "level": ["Principiante", "Intermedio", "Avanzado"][relatedId % 3],
          "location": "Región de Murcia",
          "rating": 4.0 + ((relatedId % 10) / 10),
          "vacancies": 5 + (relatedId % 10),
          "image": generatePicsumUrl(`course-related-${relatedId}`)
        });
      }

      resolve({
        success: true,
        courses: relatedCourses
      });
    }, 300);
  });
};

// Función para simular la reserva de un curso
export const bookCourse = async (courseId, turnoId, userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulamos una respuesta exitosa
      resolve({
        success: true,
        reservationId: `RES-${courseId}-${turnoId}-${Date.now()}`,
        message: "Reserva realizada con éxito"
      });
    }, 500); // Simulamos una latencia mayor para esta operación
  });
};