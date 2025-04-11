import API_BASE_URL from "@/config";

//formatter
const formatterBackToFront = (data) => {
    return {
        id: data.id,
        imagesList: data.images,
        title: data.title,
        price: data.price_per_person,
        stars: data.rating,
        numReservations: data.num_reservations,
        tags: data.tags,
        minAge: data.min_age,
        location: data.location.address,
        coordinates: {lat: data.location.lat, lng: data.location.lng}
    };
  }
// Mock data for activities
const mockActivities = [
  {
    id: "a",
    imagesList: ["/images/home/buceo.jpg", "/images/home/adultos.jpg", "/images/home/family.jpg"],
    title: "Curso de buceo para principiantes",
    location: "Andalucía, España",
    numReservations: 650,
    stars: 4.5,
    price: 150,
    tags: ["acuaticas", "adultos"],
    minAge: 16,
    coordinates: { lat: 36.5298, lng: -4.6421 }
  },
  {
    id: "b",
    imagesList: ["/images/home/family.jpg", "/images/home/buceo.jpg"],
    title: "Snorkel en familia por la costa",
    location: "Andalucía, España",
    numReservations: 432,
    stars: 4.2,
    price: 75,
    tags: ["acuaticas", "familiares"],
    minAge: 8,
    coordinates: { lat: 36.5407, lng: -4.6228 }
  },
  {
    id: "c",
    imagesList: ["/images/home/kids.jpg", "/images/home/adultos.jpg"],
    title: "Senderismo para toda la familia",
    location: "Granada, España",
    numReservations: 279,
    stars: 4.7,
    price: 45,
    tags: ["terrestres", "familiares"],
    minAge: 6,
    coordinates: { lat: 37.1768, lng: -3.5887 }
  },
  {
    id: "d",
    imagesList: ["/images/home/adultos.jpg", "/images/home/buceo.jpg"],
    title: "Escalada avanzada en roca natural",
    location: "Sierra Nevada, España",
    numReservations: 185,
    stars: 4.8,
    price: 120,
    tags: ["terrestres", "adultos"],
    minAge: 18,
    coordinates: { lat: 37.0963, lng: -3.4144 }
  },
  {
    id: "e",
    imagesList: ["/images/home/family.jpg", "/images/home/kids.jpg"],
    title: "Curso de paddle surf para principiantes",
    location: "Málaga, España",
    numReservations: 312,
    stars: 4.3,
    price: 65,
    tags: ["acuaticas", "familiares"],
    minAge: 10,
    coordinates: { lat: 36.7213, lng: -4.4213 }
  },
  {
    id: "f",
    imagesList: ["/images/home/buceo.jpg", "/images/home/adultos.jpg"],
    title: "Buceo avanzado con tiburones",
    location: "Islas Canarias, España",
    numReservations: 156,
    stars: 4.9,
    price: 280,
    tags: ["acuaticas", "adultos"],
    minAge: 18,
    coordinates: { lat: 28.2916, lng: -16.6291 }
  },
  {
    id: "g",
    imagesList: ["/images/home/family.jpg", "/images/home/kids.jpg"],
    title: "Excursión en kayak por la costa",
    location: "Costa Brava, España",
    numReservations: 287,
    stars: 4.1,
    price: 95,
    tags: ["acuaticas", "familiares"],
    minAge: 12,
    coordinates: { lat: 41.8654, lng: 3.1024 }
  },
  {
    id: "h",
    imagesList: ["/images/home/adultos.jpg", "/images/home/family.jpg"],
    title: "Paracaidismo tándem sobre el mar",
    location: "Valencia, España",
    numReservations: 198,
    stars: 4.6,
    price: 195,
    tags: ["aéreas", "adultos"],
    minAge: 18,
    coordinates: { lat: 39.4699, lng: -0.3773 }
  }
];

  
  // Function to fetch all activities
  export const fetchActivities = async (page = 1, pageSize = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities?page=${page}&page_size=${pageSize}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        mode: "cors",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Map the data to the desired format
        const activities = data.activities.map(formatterBackToFront);
        // Create pagination object

        return {activities: activities, pagination: data.pagination};
      } else {
        console.error("Error fetching activities:", data.message);
        return null;
      }

    } catch (error) {
      console.error("fetchActivities error:", error);
      return {
        activities: [],
        pagination: {
          page,
          page_size: pageSize,
          total_items: 0,
          total_pages: 0,
        },
        error: error.message,
      };
    }
  };
  
  
  // Function to simulate fetching a featured activity
  export const fetchFeaturedActivity = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return the highest-rated activity as featured
    const sortedByRating = [...mockActivities].sort((a, b) => b.stars - a.stars);
    const featured = sortedByRating[0];
    
    return {
      imagesList: featured.imagesList,
      location: featured.location,
      title: featured.title,
      minAge: featured.minAge,
      price: featured.price,
      stars: featured.stars
    };
  };
  
  // Function to simulate searching/filtering activities
  export const searchActivities = async (searchTerm, location, activityType) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return mockActivities.filter(activity => {
      const matchesSearch = !searchTerm || 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !location || 
        activity.location.toLowerCase().includes(location.toLowerCase());
      
      const matchesType = activityType === 'todos' || 
        activity.tags.includes(activityType);
      
      return matchesSearch && matchesLocation && matchesType;
    });
  };
  
  // Function to simulate fetching activity details by ID
  export const fetchActivityById = async (id) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const activity = mockActivities.find(a => a.id === id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    
    return activity;
  };