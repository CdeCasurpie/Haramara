const fetchCourses = async () => {
    try {
      const response = await fetch("http://tu-servidor.com/company/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Se envía el token en el header
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
  
export { fetchCourses };