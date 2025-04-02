import API_BASE_URL from '@/config';

// Función para generar URL de imagen con Picsum Photos
const generatePicsumUrl = (seed, width = 600, height = 600) => {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};

// Mock data para detalles de producto - puede reemplazarse con llamadas API reales
const productDetailMock = (id) => {
  const seed = `product-${id}`;
  
  return {
    "success": true,
    "product": {
      "id": parseInt(id),
      "id_service": 15,
      "name": "Equipo de Buceo Completo",
      "general_description": "Equipo de buceo profesional completo ideal para principiantes y buceadores experimentados. Incluye tanque de oxígeno, regulador, máscara y aletas de alta calidad.",
      "tags": "buceo,deportes acuáticos,submarinismo,profesional",
      "images": [
        generatePicsumUrl(`${seed}-1`),
        generatePicsumUrl(`${seed}-2`),
        generatePicsumUrl(`${seed}-3`)
      ],
      "variants": [
        {
          "id": 101,
          "id_product": parseInt(id),
          "name": "Básico - Talla S",
          "price": 150.00,
          "original_price": 180.00,
          "stock": 15,
          "specifications": {
            "Material (máscara)": "Vidrio templado",
            "Tipo de lente (máscara)": "Panorámica",
            "Volumen (máscara)": "Alto",
            "Tipo (traje)": "Semiseco",
            "Espesor (traje)": "5 mm",
            "Aletas (diseño)": "split-fin"
          }
        },
        {
          "id": 102,
          "id_product": parseInt(id),
          "name": "Básico - Talla M",
          "price": 150.00,
          "original_price": 180.00,
          "stock": 8,
          "specifications": {
            "Material (máscara)": "Vidrio templado",
            "Tipo de lente (máscara)": "Panorámica",
            "Volumen (máscara)": "Alto",
            "Tipo (traje)": "Semiseco",
            "Espesor (traje)": "5 mm",
            "Aletas (diseño)": "split-fin"
          }
        },
        {
          "id": 103,
          "id_product": parseInt(id),
          "name": "Básico - Talla L",
          "price": 150.00,
          "original_price": 180.00,
          "stock": 0,
          "specifications": {
            "Material (máscara)": "Vidrio templado",
            "Tipo de lente (máscara)": "Panorámica",
            "Volumen (máscara)": "Alto",
            "Tipo (traje)": "Semiseco",
            "Espesor (traje)": "5 mm",
            "Aletas (diseño)": "split-fin"
          }
        },
        {
          "id": 104,
          "id_product": parseInt(id),
          "name": "Premium - Talla S",
          "price": 220.00,
          "original_price": null,
          "stock": 5,
          "specifications": {
            "Material (máscara)": "Vidrio templado HD",
            "Tipo de lente (máscara)": "Ultra Panorámica",
            "Volumen (máscara)": "Bajo",
            "Tipo (traje)": "Seco",
            "Espesor (traje)": "7 mm",
            "Aletas (diseño)": "jet-fin"
          }
        },
        {
          "id": 105,
          "id_product": parseInt(id),
          "name": "Premium - Talla M",
          "price": 220.00,
          "original_price": null,
          "stock": 3,
          "specifications": {
            "Material (máscara)": "Vidrio templado HD",
            "Tipo de lente (máscara)": "Ultra Panorámica",
            "Volumen (máscara)": "Bajo",
            "Tipo (traje)": "Seco",
            "Espesor (traje)": "7 mm",
            "Aletas (diseño)": "jet-fin"
          }
        }
      ]
    }
  };
};

// Mock de productos similares - ajustado para coincidir con los requisitos del componente ProductCard
const similarProductsMock = (productId) => {
  const productTypes = [
    { id: 2, name: "Traje de Buceo 5mm", base_price: 150.00, discount_price: 120.00 },
    { id: 3, name: "Máscara de Buceo Profesional", base_price: 45.00, discount_price: null },
    { id: 4, name: "Aletas de Buceo", base_price: 80.00, discount_price: 65.00 },
    { id: 5, name: "Tanque de Oxígeno 10L", base_price: 200.00, discount_price: 180.00 }
  ];

  return {
    "success": true,
    "products": productTypes.map(product => ({
      "id": product.id,
      "name": product.name,
      "price": product.discount_price || product.base_price,
      "original_price": product.discount_price ? product.base_price : null,
      "image": generatePicsumUrl(`product-${product.id}`, 300, 300),
      "stock": Math.floor(Math.random() * 20), // Stock aleatorio entre 0-19
      "rating": (3.5 + Math.random() * 1.5).toFixed(1), // Rating aleatorio entre 3.5-5.0
      "review_count": Math.floor(Math.random() * 50) + 5 // Entre 5-54 reseñas
    }))
  };
};

// Fetch de detalles de producto - actualmente usando mock, puede reemplazarse con llamada API real
export const fetchProductDetail = async (productId) => {
  try {
    // Simular retraso de carga de API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // MOCK: Devolver datos simulados
    return productDetailMock(productId);
    
    // IMPLEMENTACIÓN DE API REAL (comentada):
    /*
    const response = await fetch(`${API_BASE_URL}/client/products/${productId}/detail`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Fetch de productos similares - actualmente usando mock, puede reemplazarse con llamada API real
export const fetchSimilarProducts = async (productId) => {
  try {
    // Simular retraso de carga de API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // MOCK: Devolver datos simulados
    return similarProductsMock(productId);
    
    // IMPLEMENTACIÓN DE API REAL (comentada):
    /*
    const response = await fetch(`${API_BASE_URL}/client/products/${productId}/similar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch similar products');
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error fetching similar products:', error);
    throw error;
  }
};

// Función para añadir al carrito - se implementaría con una llamada API real
export const addToCart = async (productData) => {
  try {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('Adding to cart:', productData);
    
    // Respuesta simulada exitosa
    return { success: true, message: 'Product added to cart' };
    
    // IMPLEMENTACIÓN DE API REAL (comentada):
    /*
    const response = await fetch(`${API_BASE_URL}/client/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      credentials: 'include',
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};