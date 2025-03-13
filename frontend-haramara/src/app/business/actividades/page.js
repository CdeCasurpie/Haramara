'use client';

import React, { useState } from 'react';
import ActivityForm from "../business-components/ActivityForm";
import BusinessActivity from "../business-components/BusinessActivity";
import styles from './Actividades.module.css';
import CustomSlider from '../business-components/CustomSlider';
import CalendarTab from '../business-components/CalendarTab';
import HaramaraButton from '@/components/HaramaraButton';
import { XIcon } from 'lucide-react';

export default function Actividades() {
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activeTab, setActiveTab] = useState('formulario');

    
    // Sample activities data
    const [activities, setActivities] = useState([
        { id: 1, title: 'Título de la actividad, en Familia', rating: 3 },
        { id: 2, title: 'Título de la actividad, en Familia', rating: 3 },
        { id: 3, title: 'Título de la actividad, en Familia', rating: 3 },
        { id: 4, title: 'Título de la actividad, en Familia', rating: 3 },
        { id: 5, title: 'Título de la actividad, en Familia', rating: 3 },
        { id: 6, title: 'Título de la actividad, en Familia', rating: 3 }
    ]);


    const handleEdit = (activity) => {
        setIsCreating(false);
        if (!isEditing) {
            setSelectedActivity(activity);
            setIsEditing(true);
            setActiveTab('formulario');
        } else {
            if (selectedActivity && selectedActivity.id === activity.id) {
                setSelectedActivity(null);
                setIsEditing(false);
            } else {
                setSelectedActivity(activity);
                setActiveTab('formulario');
            }
        }
    };

    const handleCreateActivity = () => {
        setIsEditing(false);
        setSelectedActivity(null);
        setIsCreating(true);
        setActiveTab('formulario');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleCloseForm = () => {
        setIsEditing(false);
        setIsCreating(false);
        setSelectedActivity(null);
    };

    return (
        <div className={styles.container}>
            {/* Left side - Activities list */}
            <div className={`${styles.activitiesPanel} ${(isEditing || isCreating) ? styles.halfWidth : styles.fullWidth}`}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Actividades Creadas</h1>
                    <button 
                        onClick={handleCreateActivity}
                        className={styles.createButton}
                    >
                        <span className={styles.plusIcon}>+</span> Crear nueva actividad
                    </button>
                </div>

                <CustomSlider title='' showBorder={false}>
                    {activities.map((activity) => (
                        <BusinessActivity 
                            key={activity.id} 
                            activity={activity}
                            onEdit={() => handleEdit(activity)} 
                            isEditing={selectedActivity && selectedActivity.id === activity.id}
                        />
                    ))}
                </CustomSlider>
            </div>

            {/* Right side - Form with Tabs */}
            {(isEditing || isCreating) && (
                <div className={styles.formPanel}>
                    <div className={styles.tabsContainer}>
                        <div style={{ height: '100%', display: 'flex', alignContent: 'end'}}>
                        <button 
                            className={`${styles.tab} ${activeTab === 'formulario' ? styles.activeTab : ''}`}
                            onClick={() => handleTabChange('formulario')}
                        >
                            Formulario
                        </button>
                        <button 
                            className={`${styles.tab} ${activeTab === 'turnos' ? styles.activeTab : ''}`}
                            onClick={() => handleTabChange('turnos')}
                        >
                            Turnos
                        </button>
                        </div>
                        <button className={styles.closeButton} onClick={handleCloseForm} >
                            <XIcon size={24} />
                        </button>
                    </div>

                    {activeTab === 'formulario' ? (
                        <div style={{ padding: '30px', height: '80%', overflowY: 'scroll' }}>
                            <ActivityForm 
                                initialData={selectedActivity ? {
                                    title: selectedActivity.title,
                                    description: '',
                                    price_per_person: '',
                                    min_age: '15',
                                    initial_vacancies: '',
                                    id_ubicacion: '',
                                    tags: '',
                                    characteristics: [],
                                    images: []
                                } : undefined}
                            />
                        </div>
                    ) : (
                        <div style={{ padding: '30px', height: '80%', overflowY: 'scroll' }}>
                            <CalendarTab />
                        </div>
                    )}

                    <div className={styles.footerPanel}>
                        <HaramaraButton className={styles.buttonSave}>
                            {isCreating ? 'Crear Actividad' : (isEditing ? 'Guardar Cambios' : 'Enviar Datos')}
                        </HaramaraButton>
                    </div>
                </div>
            )}
        </div>
    );
}