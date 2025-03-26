// Mock data for courses
const mockCourses = [
  {
    id: 1,
    images: [
      "/images/home/buceo.jpg"
    ],
    title: "Curso de buceo para principiantes",
    startDate: "2025-02-24",
    endDate: "2025-03-10",
    minAge: 16,
    level: "Principiante",
    location: "Andalucía, España",
    price: 150,
    numReservations: 650,
    stars: 4.5,
    coordinates: { lat: 36.5298, lng: -4.6421 }
  },
  {
    id: 2,
    images: [
      "/images/home/family.jpg"
    ],
    title: "Snorkel en familia por la costa",
    startDate: "2025-03-15",
    endDate: "2025-03-20",
    minAge: 8,
    level: "Principiante",
    location: "Andalucía, España",
    price: 75,
    numReservations: 432,
    stars: 4,
    coordinates: { lat: 36.5407, lng: -4.6228 }
  },
  {
    id: 3,
    images: [
      "/images/home/kids.jpg"
    ],
    title: "Senderismo para toda la familia",
    startDate: "2025-04-01",
    endDate: "2025-04-15",
    minAge: 6,
    level: "Intermedio",
    location: "Granada, España",
    price: 45,
    numReservations: 279,
    stars: 4.5,
    coordinates: { lat: 37.1768, lng: -3.5887 }
  },
  {
    id: 4,
    images: [
      "/images/home/adultos.jpg"
    ],
    title: "Escalada avanzada en roca natural",
    startDate: "2025-05-10",
    endDate: "2025-05-25",
    minAge: 18,
    level: "Avanzado",
    location: "Sierra Nevada, España",
    price: 120,
    numReservations: 185,
    stars: 3.5,
    coordinates: { lat: 37.0963, lng: -3.4144 }
  }
];

// Function to simulate fetching all courses
export const fetchCourses = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockCourses;
};

// Function to simulate fetching course details by ID
export const fetchCourseById = async (id) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const course = mockCourses.find(a => a.id === parseInt(id));
  if (!course) {
    throw new Error('Course not found');
  }
  
  return course;
};