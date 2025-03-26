'use client';

import React, { useState, useEffect } from 'react';
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

  // Simulated loading of activities
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get all activities
        const activitiesData = await fetchActivities();
        setActivities(activitiesData);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
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
            {loading ? (
              <div className={styles.loading}>Cargando actividades...</div>
            ) : (
              activities.map((activity) => (
                <ActivityCard key={activity.id} info={activity} />
              ))
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