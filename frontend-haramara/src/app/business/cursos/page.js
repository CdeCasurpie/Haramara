"use client";

import CourseCard from "@/components/CourseCard";
import CourseForm from "../business-components/CourseForm";
import Days from "@/components/Days";
import TurnoCurso from "@/components/TurnoCurso";
import styles from './Cursos.module.css';
import { useState } from 'react';
import HaramaraButton from '@/components/HaramaraButton';
import { XIcon } from 'lucide-react';

export default function Cursos() {
    const [activeTab, setActiveTab] = useState('formulario');
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const handleCourseSubmit = (courseData) => {
        console.log("Datos del curso enviados:", courseData);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleInputChange = (e) => {
        console.log(e.target.value);
    }
    
    const infoCursos = [
        {
            id: 1,
            imagesList: [],
            title: "curso de natacion",
            startDate: "2025-02-24",
            endDate: "2025-02-26",
            minAge: 18,
            level: "Intermedio",
            location: "Cusquito",
            price: 100,
            business: true,
            total_revenue: 1500,
            num_reservations: 10,
        },
        {
            id: 2,
            imagesList: [],
            title: "Curso de prueba",
            startDate: "2025-02-24",
            endDate: "2025-02-26",
            minAge: 18,
            level: "Intermedio",
            location: "Cusquito",
            price: 100,
            business: true,
            total_revenue: 1000,
            num_reservations: 10,
        }
    ]

    const infoTurnos = [
        {
            id: 1,
            activityId: 1,
            startTime: "08:00",
            endTime: "09:00",
            initialDays: [false, false, true, false, true, false, true],
            numReservations: 10,
            handleStudents: () => console.log("Ver alumnos"),
        },
        {
            id: 2,
            activityId: 1,
            startTime: "08:00",
            endTime: "09:00",
            initialDays: [false, false, true, false, true, false, true],
            numReservations: 10,
            handleStudents: () => console.log("Ver alumnos"),
        }
    ]

    const [days, setDays] = useState([false, false, false, false, false, false, false]);

    return (
        <div style={{ width: "100%",  display: "flex", flexDirection: "row", padding: 0, margin: 0 }}> 
            <div style={{ display: 'flex', flexDirection: 'column' }}>  
                <div className={styles.formRow} style={{padding: "0rem 2.5rem"}} >
                    <div style = {{fontSize: '1.3rem', fontWeight: '400', marginBottom: '1rem', color: 'black'}}>
                    Cursos Creados:
                    </div>
                    <HaramaraButton className={styles.buttonSave} variant="principal">
                        Crear Curso +
                    </HaramaraButton>
                </div>
                {infoCursos.map((info) => (
                    <CourseCard key={info.id} info={info} />
                ))}

            </div>
            <div style={{ width: "45%" }}>
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
            </div>
                
                {
                    activeTab === 'formulario' ? (
                        <div style={{overflowY: 'scroll' }}>
                            <CourseForm onSubmit={handleCourseSubmit}
                            />
                        </div>
                    ) : (
                        <div style={{overflowY: 'scroll', padding: '1rem'}}>
                        <div className={styles.formTurnos}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Hora de inicio: </label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        className={styles.input}
                                        onChange={handleInputChange}
                                        placeholder="Mensaje adicional"
                                    />
                                </div>  
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Hora de fin: </label>
                                    <input
                                        type="time"
                                        name="endtTime"
                                        className={styles.input}
                                        onChange={handleInputChange}
                                        placeholder="Mensaje adicional"
                                    />
                                </div>  
                            </div>
                            <div className={styles.formRow}>
                            <Days days={days} setDays={setDays} editing={true} />
                            <HaramaraButton className={styles.buttonSave}>
                                Añadir Turno +
                            </HaramaraButton>
                            </div>
                        </div>
                        <div className={styles.turnosContainer}>
                            {
                                infoTurnos.map((turno) => (
                                    <TurnoCurso key={turno.id} turno={turno} />
                                ))
                            }
                        </div>
                        </div>
                    )
                }
            </div>
            </div>
        </div>
    );
}
