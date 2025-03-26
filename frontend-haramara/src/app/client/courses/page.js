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
import { fetchCourses } from './utils';
import styles from './courses.module.css';
import CourseCard from '@/components/CourseCard';

export default function ClientCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [courseType, setCourseType] = useState('todos');
  const [loading, setLoading] = useState(true);

  // Simulated loading of courses
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get all courses
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSearch = () => {
    console.log("Searching for:", { searchTerm, location, courseType });
  };

  return (
    <div className={styles.container}>
      {/* Search Section */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <CustomInputText
            placeholder="Buscar cursos..."
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
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              options={[
                { value: 'todos', label: 'Todos los cursos' },
                { value: 'acuaticos', label: 'Cursos acuáticos' },
                { value: 'terrestres', label: 'Cursos terrestres' },
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
        <h2 className={styles.sectionTitle}>Cursos disponibles</h2>
        
        <div className={styles.contentColumns}>
          {/* Courses List */}
          <div className={styles.coursesList}>
            {loading ? (
              <div className={styles.loading}>Cargando cursos...</div>
            ) : (
              courses.map((course) => (
                <CourseCard key={course.id} info={course} />
              ))
            )}
          </div>

          {/* Map Section */}
          <div className={styles.mapContainer}>
            <ActivityMap activities={courses} />
          </div>
        </div>
      </div>
    </div>
  );
}