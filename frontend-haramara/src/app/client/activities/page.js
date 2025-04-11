'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, MapPin } from 'lucide-react';
import CustomInputText from '@/components/CustomInputText';
import CustomInputLocation from '@/components/CustomInputLocation';
import CustomSelect from '@/components/CustomSelect';
import HaramaraButton from '@/components/HaramaraButton';
import StarsRating from '@/components/Stars';
import ActivityMap from '@/components/ActivityMap';
import { fetchActivities, fetchFeaturedActivity } from './utils';

import styles from './activities.module.css';
import ActivityCard from '@/components/ActivityCard';

export default function ClientActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [activityType, setActivityType] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const page_size = 2; // Number of activities per page
  const loaderRef = useRef(null);
  const [maxPage, setMaxPage] = useState(null);
  const pageRef = useRef(page);
  const maxPageRef = useRef(maxPage);

  // Simulated loading of activities
  useEffect(() => {
    console.log("me estoy ejecutando");
    pageRef.current = page;
    const loadData = async () => {
      setLoading(true);
      try {
        // Get all activities
        const activitiesData = await fetchActivities(page, page_size);
        // settear maxPage si aún no se ha seteado	
        if (maxPage === null) {
          setMaxPage(activitiesData.pagination.total_pages);
          console.log("Max page set to:", activitiesData.pagination.total_pages);
          maxPageRef.current = activitiesData.pagination.total_pages;
        }

        console.log("Activities data of page:", page, ":", activitiesData);
        // append activitiesData to activities
        setActivities((prev) => [...prev, ...activitiesData.activities]);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoading(false);
      }
    };
    if(maxPage === null || page <= maxPage) {
      loadData();
    }
    console.log("Loading activities for page:", page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting &&(maxPageRef.current === null || pageRef.current < maxPageRef.current)) {
          //if (loading) return;
          setPage((prevPage) => prevPage + 1);
          console.log("maxPage:", maxPageRef.current);
          console.log("Loading next page:", pageRef.current + 1);
        }
      },
      {
        threshold: 1.0,
      }
    );
  
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
  
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, []);

  const handleSearch = () => {
    console.log("Searching for:", { searchTerm, location, activityType });
  };
  

  return (
    <div className={styles.container}>
      {/* Search Section */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <CustomInputText
            placeholder="Buscar actividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <CustomInputLocation
            placeholder="Ubicación..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          
          <div className={styles.selectWrapper}>
            <CustomSelect
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              options={[
                { value: 'todas', label: 'Todas las actividades' },
                { value: 'acuaticas', label: 'Actividades acuáticas' },
                { value: 'terrestres', label: 'Actividades terrestres' },
                { value: 'familiares', label: 'Para familias' },
                { value: 'adultos', label: 'Para adultos' }
              ]}
              label={'Tipo:'}
            />
          </div>
          
          <HaramaraButton variant="primary" onClick={handleSearch} className={styles.searchButton}>
            Buscar
          </HaramaraButton>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <h2 className={styles.sectionTitle}>Actividades disponibles</h2>
        
        <div className={styles.contentColumns}>
          {/* Activities List */}
          <div className={styles.activitiesList}>
            {activities.map((activity) => (
              <ActivityCard key={activity.id} info={activity} />
            ))}

            {loading && <div className={styles.loading}>Cargando actividades...</div>}

            {/* Infinite scroll trigger */}
            <div ref={loaderRef} className={styles.loaderRef}></div>

            {/* Mensaje de fin de las actividades */}
            {maxPage !== null && page >= maxPage && (
              <div className={styles.endMessage}>No hay más actividades para mostrar.</div>
            )}


          </div>

          {/* Map Section */}
          <div className={styles.mapContainer}>
            <ActivityMap activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}