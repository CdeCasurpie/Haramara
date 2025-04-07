'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import Image from 'next/image';
import { fetchCourseDetail, fetchRelatedCourses } from './utils';
import SingleCourseView from './components/SingleCourseView';
import Link from 'next/link';

export default function CourseDetailPage() {
  const params = useParams();
  const { id } = params;
  const [courseData, setCourseData] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del curso
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        
        // Cargar detalles del curso
        const courseResponse = await fetchCourseDetail(id);
        if (courseResponse.success) {
          setCourseData(courseResponse.course);
        } else {
          throw new Error('Error al cargar los detalles del curso');
        }

        // Cargar cursos relacionados
        const relatedResponse = await fetchRelatedCourses(id);
        if (relatedResponse.success) {
          setRelatedCourses(relatedResponse.courses);
        }
        
      } catch (err) {
        console.error('Error cargando datos del curso:', err);
        setError('No pudimos cargar la información del curso. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourseData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>Cargando información del curso...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Componente principal de detalle de curso */}
      <SingleCourseView courseData={courseData} />
      
      {/* Sección de cursos relacionados */}
      <div className={styles.relatedCoursesSection}>
        <h2 className={styles.sectionTitle}>Cursos que te podrían interesar</h2>
        
        {relatedCourses.length > 0 ? (
          <div className={styles.relatedCoursesGrid}>
            {relatedCourses.map(course => (
              <Link href={`/client/courses/${course.id}`} key={course.id} className={styles.courseCard}>
                <div className={styles.courseImageContainer}>
                  <Image
                    src={course.image}
                    alt={course.titulo}
                    fill
                    className={styles.courseImage}
                  />
                </div>
                <div className={styles.courseInfo}>
                  <h3 className={styles.courseTitle}>{course.titulo}</h3>
                  <div className={styles.courseDetails}>
                    <span className={styles.courseLocation}>{course.location}</span>
                    <span className={styles.coursePrice}>{course.price}€</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.noRelatedCourses}>
            No hay cursos relacionados disponibles en este momento.
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}