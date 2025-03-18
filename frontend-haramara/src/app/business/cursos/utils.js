import  API_BASE_URL from "@/config";

const fetchCourses = async () => {
    try {
      const response = await  fetch(`${API_BASE_URL}/company/courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors",
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        console.log("Cursos obtenidos:", data.courses);
        return data.courses; // Devuelve los cursos para usarlos en el estado
      } else {
        console.error("Error obteniendo cursos:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      return [];
    }
  };

//create course
/*
front:
    - title
    - price
    - startDate
    - endDate
    - message
    - description
    - tags
    - vacancies
    - location
    - images
    - minAge
    - images


back:
    - titulo
    - price
    - start_date
    - end_date
    - adittional_info
    - description
    - tags
    - vacancies
    - ubicacion
    - min_age

*/

const createCourse = async (courseData) => {
    console.log("kk");
    const requestData = {
        titulo: courseData.title,
        price: courseData.price,
        start_date: courseData.startDate,
        end_date: courseData.endDate,
        adittional_info: courseData.message,
        description: courseData.description,
        tags: courseData.tags,
        vacancies: courseData.vacancies,
        ubicacion: courseData.location,
        min_age: courseData.minAge,
    }

    try {
        const response = await fetch(`${API_BASE_URL}/company/courses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            credentials: "include",
            body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log("inka cola");
            console.log(data)
            return data
        } else {
            console.error("Error creando cursoXXX:", data.message);
            return null;
        }
    } catch (error) {
        console.error("Error en la peticiónZZZZZZZZZ:", error);
        return null;
    }
}
  


export { fetchCourses , createCourse};