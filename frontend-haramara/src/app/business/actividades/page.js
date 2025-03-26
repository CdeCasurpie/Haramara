'use client';

import React, { useState, useEffect } from 'react';
import ActivityForm from "../business-components/ActivityForm";
import BusinessActivity from "../business-components/BusinessActivity";
import styles from './Actividades.module.css';
import CustomSlider from '../business-components/CustomSlider';
import CalendarTab from '../business-components/CalendarTab';
import HaramaraButton from '@/components/HaramaraButton';
import { XIcon } from 'lucide-react';
import { 
    fetchActivities, 
    fetchActivityById, 
    createActivity, 
    updateActivity, 
    fetchShiftsByActivityId, 
    createShifts 
} from './utils';

export default function Actividades() {
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState('formulario');
    const [isLoading, setIsLoading] = useState(true);
    
    // Estado para los turnos de la actividad seleccionada
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityShifts, setActivityShifts] = useState([]);
    
    // Estado para la lista de actividades
    const [activities, setActivities] = useState([]);
    
    // Cargar actividades al iniciar
    useEffect(() => {
        const loadActivities = async () => {
            try {
                setIsLoading(true);
                const data = await fetchActivities();
                setActivities(data);
            } catch (error) {
                console.error("Error cargando actividades:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadActivities();
    }, []);

    const handleEdit = async (activity) => {
        setIsCreating(false);
        if (!isEditing) {
            setSelectedActivity(activity);
            setIsEditing(true);
            setActiveTab('formulario');
            
            // Cargar los turnos de la actividad seleccionada
            try {
                const shifts = await fetchShiftsByActivityId(activity.id);
                setActivityShifts(shifts);
            } catch (error) {
                console.error("Error cargando turnos:", error);
                setActivityShifts([]);
            }
        } else {
            if (selectedActivity && selectedActivity.id === activity.id) {
                setSelectedActivity(null);
                setIsEditing(false);
                setActivityShifts([]);
            } else {
                setSelectedActivity(activity);
                setActiveTab('formulario');
                
                // Cargar turnos para la nueva actividad seleccionada
                try {
                    const shifts = await fetchShiftsByActivityId(activity.id);
                    setActivityShifts(shifts);
                } catch (error) {
                    console.error("Error cargando turnos:", error);
                    setActivityShifts([]);
                }
            }
        }
    };

    const handleCreateActivity = () => {
        setIsEditing(false);
        setSelectedActivity({
            title: '',
            description: '',
            price_per_person: '',
            min_age: '15',
            initial_vacancies: '',
            location: null,
            tags: '',
            characteristics: [],
            images: []
        });
        setIsCreating(true);
        setActiveTab('formulario');
        setActivityShifts([]); // Reset de turnos al crear una nueva actividad
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleCloseForm = () => {
        setIsEditing(false);
        setIsCreating(false);
        setSelectedActivity(null);
        setActivityShifts([]);
    };

    const handleSave = async () => {
        if (!selectedActivity) return;
        
        try {
            if (isCreating) {
                // Crear nueva actividad
                const newActivity = await createActivity(selectedActivity);
                setActivities([...activities, newActivity]);
                
                // Guardar los turnos nuevos (los que no tienen ID)
                // No es necesario filtrar aquí porque todos son nuevos
                if (activityShifts.length > 0) {
                    await createShifts(newActivity.id, activityShifts);
                }
                
                // Resetear estados
                setIsCreating(false);
                setSelectedActivity(null);
                setActivityShifts([]);
            } else if (isEditing) {
                // Actualizar actividad existente
                const updatedActivity = await updateActivity(selectedActivity.id, selectedActivity);
                await createShifts(selectedActivity.id, activityShifts);
                
                // Actualizar la lista de actividades
                const updatedActivities = activities.map(act => 
                    act.id === updatedActivity.id ? updatedActivity : act
                );
                setActivities(updatedActivities);
                
                
                
                // Resetear estados
                setIsEditing(false);
                setSelectedActivity(null);
                setActivityShifts([]);
            }
        } catch (error) {
            console.error("Error guardando actividad:", error);
            alert("Error guardando actividad");
        }
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

                {isLoading ? (
                    <div>Cargando actividades...</div>
                ) : (
                    <CustomSlider title='' showBorder={false} itemHeight={140}>
                        {activities.map((activity) => (
                            <BusinessActivity 
                                key={activity.id} 
                                activity={activity}
                                onEdit={() => handleEdit(activity)} 
                                isEditing={selectedActivity && selectedActivity.id === activity.id}
                            />
                        ))}
                    </CustomSlider>
                )}

                {/* Debug section - Puedes eliminar esto en producción */}
                {selectedActivity && (
                    <>
                    {/* <pre
                        style={{
                            width: '100%',
                            color: 'black'
                        }}
                    >{JSON.stringify(selectedActivity, null, 2)}</pre>
                    <pre
                        style={{
                            width: '100%',
                            color: 'black'
                        }}
                    >{JSON.stringify(activityShifts, null, 2)}</pre> */}
                    </>
                )}
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
                                activity={selectedActivity}
                                setSelectedActivity={setSelectedActivity}
                            />
                        </div>
                    ) : (
                        <div style={{ padding: '30px', height: '80%', overflowY: 'scroll' }}>
                            <CalendarTab 
                                activityId={selectedActivity?.id}
                                activityShifts={activityShifts}
                                setActivityShifts={setActivityShifts}
                            />
                        </div>
                    )}

                    <div className={styles.footerPanel}>
                        <HaramaraButton className={styles.buttonSave} onClick={handleSave}>
                            {isCreating ? 'Crear Actividad' : (isEditing ? 'Guardar Cambios' : 'Enviar Datos')}
                        </HaramaraButton>
                    </div>
                </div>
            )}
        </div>
    );
}