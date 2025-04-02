'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ShoppingCart } from 'lucide-react';
import CustomInputText from '@/components/CustomInputText';
import CustomInputLocation from '@/components/CustomInputLocation';
import CustomSelect from '@/components/CustomSelect';
import HaramaraButton from '@/components/HaramaraButton';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, searchProducts } from './utils';
import styles from './productos.module.css';

export default function ClientProductsPage() {
  // Estados principales
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [productType, setProductType] = useState('todos');
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [currentPriceRange, setCurrentPriceRange] = useState([0, 4000]);
  const [searchParams, setSearchParams] = useState({});

  // Estados para filtros adicionales
  const [filters, setFilters] = useState({
    ageRestrictions: {
      none: false,
      age8: false,
      age12: false,
      age16: false
    },
    experienceLevel: {
      beginner: false,
      intermediate: false,
      advanced: false,
      professional: false
    },
    brands: {
      cressi: false,
      mares: false,
      scubapro: false,
      aqualung: false
    },
    onlyDiscounted: false,
    onlyAvailable: false
  });

  // Cargar productos al inicio
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const productsData = await fetchProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Función para manejar cambios en los checkboxes
  const handleCheckboxChange = (category, key) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  // Función para manejar cambios en los toggles
  const handleToggleChange = (field) => {
    setFilters(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Función para manejar cambios en el rango de precios
  const handlePriceRangeChange = (event) => {
    const value = parseInt(event.target.value);
    setCurrentPriceRange([0, value]);
  };

  // Función para manejar el cambio manual de precios
  const handlePriceInputChange = (index, value) => {
    const newPriceRange = [...currentPriceRange];
    newPriceRange[index] = value === '' ? 0 : parseInt(value);
    setCurrentPriceRange(newPriceRange);
  };

  // Aplica los filtros cuando se hace clic en buscar
  const handleSearch = async () => {
    setLoading(true);
    setSearchPerformed(true);

    // Preparar los parámetros de búsqueda para enviar al backend
    const params = {
      searchTerm,
      productType,
      priceMin: currentPriceRange[0],
      priceMax: currentPriceRange[1],
      filters: {
        ageRestrictions: Object.entries(filters.ageRestrictions)
          .filter(([_, isSelected]) => isSelected)
          .map(([key]) => key),
        experienceLevel: Object.entries(filters.experienceLevel)
          .filter(([_, isSelected]) => isSelected)
          .map(([key]) => key),
        brands: Object.entries(filters.brands)
          .filter(([_, isSelected]) => isSelected)
          .map(([key]) => key),
        onlyDiscounted: filters.onlyDiscounted,
        onlyAvailable: filters.onlyAvailable
      }
    };

    // Guardar los parámetros para mostrarlos
    setSearchParams(params);

    try {
      // Simular búsqueda en el backend
      const results = await searchProducts(params);
      setFilteredProducts(results);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar los filtros
  const applyFilters = () => {
    // Actualizar el rango de precios final y realizar la búsqueda
    setPriceRange(currentPriceRange);
    handleSearch();
  };

  return (
    <div className={styles.container}>
      {/* Barra de búsqueda */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <CustomInputText
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className={styles.selectWrapper}>
            <CustomSelect
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              options={[
                { value: 'todos', label: 'Todos los productos' },
                { value: 'buceo', label: 'Equipos de buceo' },
                { value: 'snorkel', label: 'Equipos de snorkel' },
                { value: 'accesorios', label: 'Accesorios' },
                { value: 'ropa', label: 'Ropa de baño' }
              ]}
              label={'Tipo:'}
            />
          </div>
          
          <HaramaraButton variant="primary" onClick={handleSearch} className={styles.searchButton}>
            Buscar
          </HaramaraButton>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Productos disponibles</h2>
          <div className={styles.cartIcon}>
            <ShoppingCart size={24} />
            <span className={styles.cartCount}>0</span>
          </div>
        </div>
        
        {/* Columnas de contenido */}
        <div className={styles.contentColumns}>
          {/* Columna de filtros */}
          <div className={styles.filtersColumn}>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Filtros</h3>
              
              {/* Filtro de rango de precios */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Rango de precio</h4>
                <div className={styles.rangeContainer}>
                  <div className={styles.rangeLabels}>
                    <span className={styles.rangeLabel}>€{currentPriceRange[0]}</span>
                    <span className={styles.rangeLabel}>€{currentPriceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4000"
                    value={currentPriceRange[1]}
                    onChange={handlePriceRangeChange}
                    className={styles.rangeSlider}
                  />
                  <div className={styles.priceRangeTicks}>
                    <span className={styles.priceTick}>0€</span>
                    <span className={styles.priceTick}>1000€</span>
                    <span className={styles.priceTick}>2000€</span>
                    <span className={styles.priceTick}>3000€</span>
                    <span className={styles.priceTick}>4000€</span>
                  </div>
                  <div className={styles.rangeInputs}>
                    <input
                      type="number"
                      min="0"
                      max={currentPriceRange[1]}
                      value={currentPriceRange[0]}
                      onChange={(e) => handlePriceInputChange(0, e.target.value)}
                      className={styles.rangeInput}
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      min={currentPriceRange[0]}
                      max="4000"
                      value={currentPriceRange[1]}
                      onChange={(e) => handlePriceInputChange(1, e.target.value)}
                      className={styles.rangeInput}
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
              
              {/* Filtro de edad mínima */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Edad mínima</h4>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.ageRestrictions.none}
                      onChange={() => handleCheckboxChange('ageRestrictions', 'none')}
                    />
                    <span className={styles.checkmark}></span>
                    Sin restricción
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.ageRestrictions.age8}
                      onChange={() => handleCheckboxChange('ageRestrictions', 'age8')}
                    />
                    <span className={styles.checkmark}></span>
                    A partir de 8 años
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.ageRestrictions.age12}
                      onChange={() => handleCheckboxChange('ageRestrictions', 'age12')}
                    />
                    <span className={styles.checkmark}></span>
                    A partir de 12 años
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.ageRestrictions.age16}
                      onChange={() => handleCheckboxChange('ageRestrictions', 'age16')}
                    />
                    <span className={styles.checkmark}></span>
                    A partir de 16 años
                  </label>
                </div>
              </div>
              
              {/* Filtro de nivel de experiencia */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Nivel de experiencia</h4>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.experienceLevel.beginner}
                      onChange={() => handleCheckboxChange('experienceLevel', 'beginner')}
                    />
                    <span className={styles.checkmark}></span>
                    Principiante
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.experienceLevel.intermediate}
                      onChange={() => handleCheckboxChange('experienceLevel', 'intermediate')}
                    />
                    <span className={styles.checkmark}></span>
                    Intermedio
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.experienceLevel.advanced}
                      onChange={() => handleCheckboxChange('experienceLevel', 'advanced')}
                    />
                    <span className={styles.checkmark}></span>
                    Avanzado
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.experienceLevel.professional}
                      onChange={() => handleCheckboxChange('experienceLevel', 'professional')}
                    />
                    <span className={styles.checkmark}></span>
                    Profesional
                  </label>
                </div>
              </div>
              
              {/* Filtro de marca */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Marca</h4>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.brands.cressi}
                      onChange={() => handleCheckboxChange('brands', 'cressi')}
                    />
                    <span className={styles.checkmark}></span>
                    Cressi
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.brands.mares}
                      onChange={() => handleCheckboxChange('brands', 'mares')}
                    />
                    <span className={styles.checkmark}></span>
                    Mares
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.brands.scubapro}
                      onChange={() => handleCheckboxChange('brands', 'scubapro')}
                    />
                    <span className={styles.checkmark}></span>
                    Scubapro
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={filters.brands.aqualung}
                      onChange={() => handleCheckboxChange('brands', 'aqualung')}
                    />
                    <span className={styles.checkmark}></span>
                    Aqualung
                  </label>
                </div>
              </div>
              
              {/* Filtros de toggle */}
              <div className={styles.filterGroup}>
                <div className={styles.toggleContainer}>
                  <span className={styles.toggleLabel}>Solo con descuento</span>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox"
                      checked={filters.onlyDiscounted}
                      onChange={() => handleToggleChange('onlyDiscounted')}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <div className={styles.filterGroup}>
                <div className={styles.toggleContainer}>
                  <span className={styles.toggleLabel}>Disponible ahora</span>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox"
                      checked={filters.onlyAvailable}
                      onChange={() => handleToggleChange('onlyAvailable')}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <HaramaraButton variant="primary" onClick={applyFilters} className={styles.filterButton}>
                Aplicar filtros
              </HaramaraButton>
            </div>
          </div>

          {/* Lista de productos */}
          <div className={styles.productsColumn}>
            {loading ? (
              <div className={styles.loading}>Cargando productos...</div>
            ) : filteredProducts.length === 0 && searchPerformed ? (
              <div className={styles.noResults}>
                No se encontraron productos que coincidan con tu búsqueda.
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <ProductCard
                      id={product.id}
                      imageUrl={product.imageUrl}
                      title={product.title}
                      price={product.price}
                      discountPrice={product.discountPrice}
                      ratings={product.ratings}
                      reviewCount={product.reviewCount}
                      inventory={product.inventory}
                      href={`/client/products/${product.id}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}