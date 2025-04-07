import  API_BASE_URL from "@/config";

const formatterBackToFront = (data) => {
    return {
        id: data.id,
        imagesList: data.images,
        location: data.location,
        title: data.title,
        minAge: data.min_age,
        price: data.price_per_person,
        stars: data.rating,
        description: data.description,
        features: data.characteristics,
    };
}

export const fetchActivityDetails = async (id) => {
    try{
        const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            mode: "cors",
            credentials: "include",
        });

        const data = await response.json();

        if(response.ok && data.success){
            return formatterBackToFront(data.activity);
        } else{
            console.error("Error obteniendo detalles de la actividad:", data.message);
            return null;
        }
    } catch(error){
        console.error("Error en la petición:", error);
        return null;
    }
};

export const fetchTurnosPerYear = async (id, year) => {
    try {
        const response = await fetch(`${API_BASE_URL}/activities/${id}/shifts?year=${year}`, {
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
            return { shifts: data.shifts, occupied_days: data.occupied_days };
        } else {
            console.error("Error obteniendo turnos:", data.message);
            return null;
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        return null;
    }
};

