/**
 * Archivo de utilidades para gestionar los datos de la empresa con consultas reales a la API
 */

import API_BASE_URL from "@/config";

/**
 * Configura los headers y opciones para las peticiones fetch
 * @param {string} contentType - Tipo de contenido para la petición
 * @returns {Object} Objeto con las opciones configuradas para fetch
 */
const getFetchOptions = (contentType = 'application/json') => {
  return {
    credentials: 'include', // Para incluir cookies en solicitudes cross-origin
    headers: {
      'Content-Type': contentType,
      'ngrok-skip-browser-warning': 'true'
    }
  };
};

/**
 * Procesar respuesta de fetch y manejar errores comunes
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise<Object>} Datos de la respuesta
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
  }
  
  if (!data.success) {
    throw new Error(data.message || 'La operación no fue exitosa');
  }
  
  return data;
};

/**
 * Obtiene los datos de la empresa del usuario autenticado
 * @returns {Promise<Object>} Datos de la empresa
 */
export const fetchCompanyData = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/company/profile`, 
      {
        method: 'GET',
        ...getFetchOptions()
      }
    );
    
    const data = await handleResponse(response);
    
    // Asumiendo que la respuesta tiene una estructura con company y location
    const companyData = data.company || {};
    const locationData = data.location || {};
    
    // Construir objeto con la estructura esperada por el frontend
    return {
      name: companyData.name || '',
      email: companyData.email || '',
      url_image_logo: companyData.url_image_logo || '',
      url_image_portada: companyData.url_image_portada || '',
      name_representative: companyData.name_representative || '',
      last_name_representative: companyData.last_name_representative || '',
      is_safe: Boolean(companyData.is_safe),
      has_languages: Boolean(companyData.has_languages),
      description: companyData.description || '',
      password: '', // Siempre vacío al cargar los datos
      // Datos de ubicación
      location: {
        address: locationData.address || '',
        country: locationData.country || '',
        comunity: locationData.comunity || '',
        province: locationData.province || '',
        postal_code: locationData.postal_code || ''
      }
    };
  } catch (error) {
    console.error('Error al obtener datos de la empresa:', error);
    throw new Error(error.message || 'Error en la conexión con el servidor');
  }
};

/**
 * Actualiza los datos de la empresa
 * @param {Object} companyData - Datos de la empresa a actualizar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateCompanyData = async (companyData) => {
  try {
    // Extraer datos de ubicación y password para manejarlos apropiadamente
    const { location, password, ...companyInfo } = companyData;
    
    // Preparar payload para la API
    const payload = {
      company: {
        ...companyInfo
      },
      location: location
    };
    
    // Si se proporcionó una nueva contraseña, incluirla en el payload
    if (password && password.trim() !== '') {
      payload.company.password = password;
    }
    
    const response = await fetch(
      `${API_BASE_URL}/company/profile`, 
      {
        method: 'PUT',
        ...getFetchOptions(),
        body: JSON.stringify(payload)
      }
    );
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al actualizar datos de la empresa:', error);
    throw new Error(error.message || 'Error en la conexión con el servidor');
  }
};

/**
 * Actualiza las imágenes de la empresa (logo y/o portada)
 * @param {File|null} logoFile - Archivo de imagen del logo
 * @param {File|null} coverFile - Archivo de imagen de portada
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateCompanyImages = async (logoFile, coverFile) => {
  try {
    // Si no hay archivos para subir, no hacer nada
    if (!logoFile && !coverFile) {
      return { success: true, message: 'No hay imágenes para actualizar' };
    }
    
    const formData = new FormData();
    
    // Añadir archivos al FormData solo si existen
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    
    if (coverFile) {
      formData.append('cover', coverFile);
    }
    
    // Para FormData, no enviamos Content-Type en headers, el navegador lo establece automáticamente
    const response = await fetch(
      `${API_BASE_URL}/company/upload-images`, 
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      }
    );
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al actualizar imágenes:', error);
    throw new Error(error.message || 'Error en la conexión con el servidor');
  }
};

export default {
  fetchCompanyData,
  updateCompanyData,
  updateCompanyImages
};