// Datos de productos simulados
const mockProducts = [
    {
      id: 1,
      imageUrl: "/images/home/buceo.jpg",
      title: "Equipo de buceo completo",
      price: 3600,
      discountPrice: 1256,
      ratings: 4.5,
      reviewCount: 124,
      inventory: 8,
      category: "buceo"
    },
    {
      id: 2,
      imageUrl: "/images/home/adultos.jpg",
      title: "Aletas de buceo profesionales",
      price: 450,
      discountPrice: null,
      ratings: 5,
      reviewCount: 87,
      inventory: 15,
      category: "buceo"
    },
    {
      id: 3,
      imageUrl: "/images/home/family.jpg",
      title: "Traje de neopreno 3mm",
      price: 890,
      discountPrice: 699,
      ratings: 4.0,
      reviewCount: 56,
      inventory: 3,
      category: "buceo"
    },
    {
      id: 4,
      imageUrl: "/images/home/kids.jpg",
      title: "Máscara de buceo con tubo",
      price: 280,
      discountPrice: null,
      ratings: 3.5,
      reviewCount: 42,
      inventory: 0,
      category: "snorkel"
    },
    {
      id: 5,
      imageUrl: "/images/home/buceo.jpg",
      title: "Botella de oxígeno para buceo",
      price: 1200,
      discountPrice: 950,
      ratings: 4.8,
      reviewCount: 96,
      inventory: 5,
      category: "buceo"
    },
    {
      id: 6,
      imageUrl: "/images/home/family.jpg",
      title: "Regulador de buceo profesional",
      price: 350,
      discountPrice: null,
      ratings: 4.2,
      reviewCount: 38,
      inventory: 7,
      category: "buceo"
    },
    {
      id: 7,
      imageUrl: "/images/home/adultos.jpg",
      title: "Chaleco de buceo ajustable",
      price: 580,
      discountPrice: 499,
      ratings: 4.3,
      reviewCount: 72,
      inventory: 9,
      category: "buceo"
    },
    {
      id: 8,
      imageUrl: "/images/home/kids.jpg",
      title: "Set de snorkel para niños",
      price: 120,
      discountPrice: 90,
      ratings: 4.6,
      reviewCount: 145,
      inventory: 25,
      category: "snorkel"
    },
    {
      id: 9,
      imageUrl: "/images/home/buceo.jpg",
      title: "Gafas de buceo profesionales",
      price: 180,
      discountPrice: null,
      ratings: 4.4,
      reviewCount: 67,
      inventory: 12,
      category: "buceo"
    },
    {
      id: 10,
      imageUrl: "/images/home/family.jpg",
      title: "Traje de baño profesional",
      price: 89,
      discountPrice: 65,
      ratings: 4.1,
      reviewCount: 93,
      inventory: 30,
      category: "ropa"
    },
    {
      id: 11,
      imageUrl: "/images/home/adultos.jpg",
      title: "Reloj de buceo resistente hasta 100m",
      price: 320,
      discountPrice: null,
      ratings: 4.7,
      reviewCount: 58,
      inventory: 6,
      category: "accesorios"
    },
    {
      id: 12,
      imageUrl: "/images/home/kids.jpg",
      title: "Bolsa impermeable para equipamiento",
      price: 75,
      discountPrice: 60,
      ratings: 4.0,
      reviewCount: 47,
      inventory: 18,
      category: "accesorios"
    }
  ];
  
// Función para simular la obtención de todos los productos
export const fetchProducts = async () => {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockProducts;
};

// Función para simular la obtención de detalles de un producto por ID
export const fetchProductById = async (id) => {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) {
    throw new Error('Producto no encontrado');
    }
    
    return product;
};

// Función para simular la búsqueda de productos
export const searchProducts = async (searchTerm) => {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const filteredProducts = mockProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filteredProducts;
};