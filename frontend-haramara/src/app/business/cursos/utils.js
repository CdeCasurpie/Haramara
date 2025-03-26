import  API_BASE_URL from "@/config";

const fetchCourses = async () => {
    try {
      const response = await  fetch(`${API_BASE_URL}/company/courses`, {
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

const createCourse = async (courseData, fileImages) => {

  // Crear FormData para enviar datos y archivos
  const formData = new FormData();
  formData.append("titulo", courseData.titulo);
  formData.append("price", courseData.price);
  formData.append("start_date", courseData.start_date);
  formData.append("end_date", courseData.end_date);
  formData.append("adittional_info", courseData.adittional_info);
  formData.append("description", courseData.description);
  formData.append("tags", courseData.tags);
  formData.append("vacancies", courseData.vacancies);
  formData.append("ubicacion", JSON.stringify(courseData.location)); // Convertir ubicación a JSON
  formData.append("min_age", courseData.min_age);


  if (fileImages && fileImages.length > 0) {
      fileImages.forEach((file) => {
          formData.append("images", file);
      });
  }


  try {
      const response = await fetch(`${API_BASE_URL}/company/courses`, {
          method: "POST",
          headers: {
              "ngrok-skip-browser-warning": "true",
          },
          mode: "cors",
          credentials: "include",
          body: formData, // Enviar FormData con archivos
      });

      const data = await response.json();

      if (response.ok && data.success) {
          console.log("Curso creado exitosamente:", data);
          return data;
      } else {
          console.error("Error creando curso:", data.message);
          return null;
      }
  } catch (error) {
      console.error("Error en la petición:", error);
      return null;
  }
};

const updateCourse = async (courseData, fileImages, imagesDeleted) => {
  const courseId = courseData.id;
  console.log("location", courseData.location);
  console.log("new images", fileImages);
  // Crear FormData para enviar datos y archivos
  const formData = new FormData();
  formData.append("titulo", courseData.titulo);
  formData.append("price", courseData.price);
  formData.append("start_date", courseData.start_date);
  formData.append("end_date", courseData.end_date);
  formData.append("adittional_info", courseData.adittional_info);
  formData.append("description", courseData.description);
  formData.append("tags", courseData.tags);
  formData.append("vacancies", courseData.vacancies);
  formData.append("ubicacion", JSON.stringify(courseData.location)); // Convertir ubicación a JSON
  formData.append("min_age", courseData.min_age);
  formData.append("images_deleted", imagesDeleted);
  


  if (fileImages && fileImages.length > 0) {
      fileImages.forEach((file) => {
          formData.append("images", file);
      });
  }


  try {
      const response = await fetch(`${API_BASE_URL}/company/courses/${courseId}`, {
          method: "PUT",
          headers: {
              "ngrok-skip-browser-warning": "true",
          },
          mode: "cors",
          credentials: "include",
          body: formData, // Enviar FormData con archivos
      });

      const data = await response.json();

      if (response.ok && data.success) {
          console.log("Curso actualizado exitosamente:", data);
          return data;
      } else {
          console.error("Error actualizando curso:", data.message);
          return null;
      }
  } catch (error) {
      console.error("Error en la petición:", error);
      return null;
  }
};

export { fetchCourses , createCourse, updateCourse };