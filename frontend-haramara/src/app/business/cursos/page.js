"use client";

import CourseCard from "@/components/CourseCard";
import CourseForm from "../business-components/CourseForm";
import Days from "@/components/Days";
import TurnoCurso from "@/components/TurnoCurso";
import styles from '../actividades/Actividades.module.css';
import stylesCursos from './Cursos.module.css';
import { useEffect, useState } from 'react';
import HaramaraButton from '@/components/HaramaraButton';
import { XIcon } from 'lucide-react';
import { fetchCourses, createCourse } from './utils';
import CustomSlider from '../business-components/CustomSlider';

export default function Cursos() {
    const [activeTab, setActiveTab] = useState('formulario');
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [state, setState] = useState("normal");
    const [turnos, setTurnos] = useState([
        {
            id: 1,
            courseId: 1,
            startTime: "08:00",
            endTime: "09:00",
            initialDays: [false, false, true, false, true, false, true],
            numReservations: 10,
            handleStudents: () => console.log("Ver alumnos"),
        },
        {
            id: 2,
            courseId: 1,
            startTime: "08:00",
            endTime: "09:00",
            initialDays: [false, false, true, false, true, false, true],
            numReservations: 10,
            handleStudents: () => console.log("Ver alumnos"),
        }
    ]);
    const [TurnosFormData, setTurnosFormData] = useState({
        startTime: '',
        endTime: '',
        days: [false, false, false, false, false, false, false],
    });
    const [newTurnos, setNewTurnos] = useState([]);
    const [infoCursos, setInfoCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState([false, false, false, false, false, false, false]);
    const [fileImages, setFileImages] = useState([]);

    // Actualizar el estado basado en isCreating o isEditing
    useEffect(() => {
        if (isCreating) {
            setState("creating");
        } else if (isEditing) {
            setState("editing");
        } else {
            setState("normal");
        }
    }, [isCreating, isEditing]);

    // Cargar cursos al iniciar
    useEffect(() => {
        const fetchInfoCursos = async () => {
            try {
                const data = await fetchCourses();
                setInfoCursos(data);
                setLoading(false);
            } catch (error) {
                console.error("Error en fetchInfoCursos:", error);
                setLoading(false);
            }
        };
        fetchInfoCursos();
    }, []);

    const handleCourseSubmit = async () => {
        if (!currentCourse) return;
        
        try {
            if (isCreating) {
                // Crear nuevo curso
                const newCourse = await createCourse(currentCourse, fileImages);
                setInfoCursos([...infoCursos, newCourse.data]);
                
                // Crear turnos si hay
                if (newTurnos.length > 0) {
                    // Aquí iría la lógica para crear turnos
                    console.log("Turnos a crear", newTurnos);
                }
            } else if (isEditing) {
                // Aquí iría la lógica para actualizar el curso
                console.log("Editando curso", currentCourse);
                
                // Y actualizar turnos si hay
                if (newTurnos.length > 0) {
                    console.log("Turnos a actualizar", newTurnos);
                }
            }
            
            // Resetear estados
            setNewTurnos([]);
            setIsEditing(false);
            setIsCreating(false);
            setCurrentCourse(null);
            setActiveTab('formulario');
            setState("normal");
            
        } catch (error) {
            console.error("Error en handleCourseSubmit:", error);
            alert("Error guardando curso");
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleInputChange = (e) => {
        setTurnosFormData({
            ...TurnosFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleTurnoAddSubmit = (e) => {
        e.preventDefault();
        console.log("Añadir turno", TurnosFormData);
        
        // Añadir a la lista de turnos visibles
        const newTurno = {
            id: turnos.length + 1,
            courseId: currentCourse?.id || 1,
            startTime: TurnosFormData.startTime,
            endTime: TurnosFormData.endTime,
            initialDays: days,
            numReservations: 0,
            handleStudents: () => console.log("Ver alumnos"),
        };
        
        setTurnos([...turnos, newTurno]);
        
        // Añadir a la lista de turnos para enviar al backend
        setNewTurnos([...newTurnos, {
            id_course: currentCourse?.id,
            start_time: TurnosFormData.startTime,
            end_time: TurnosFormData.endTime,
            frequency: days,
        }]);
        
        // Reiniciar el formulario
        setTurnosFormData({
            startTime: '',
            endTime: '',
            days: [false, false, false, false, false, false, false],
        });
        setDays([false, false, false, false, false, false, false]);
    };

    const handleCreateCourse = () => {
        setIsEditing(false);
        setCurrentCourse({
            title: '',
            description: '',
            price: '',
            startDate: '',
            endDate: '',
            minAge: '15',
            vacancies: '',
            location: null,
            tags: '',
            images: []
        });
        setIsCreating(true);
        setActiveTab('formulario');
        setTurnos([]); // Reset de turnos al crear un nuevo curso
    };
    
    const handleEditCourse = (course) => {
        setIsCreating(false);
        setCurrentCourse(course);
        setIsEditing(true);
        setActiveTab('formulario');
        
        // Aquí podríamos cargar los turnos del curso
        // En un caso real, haríamos una petición al backend
        // setTurnos([...turnos_del_curso]);
    };
    
    const handleCloseForm = () => {
        setIsEditing(false);
        setIsCreating(false);
        setCurrentCourse(null);
        setTurnos([]);
    };

    return (
        <div className={styles.container}>
            {/* Left side - Courses list */}
            <div className={`${styles.activitiesPanel} ${(isEditing || isCreating) ? styles.halfWidth : styles.fullWidth}`}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Cursos Creados</h1>
                    <button 
                        onClick={handleCreateCourse}
                        className={styles.createButton}
                    >
                        <span className={styles.plusIcon}>+</span> Crear nuevo curso
                    </button>
                </div>

                {loading ? (
                    <div>Cargando cursos...</div>
                ) : (
                    <CustomSlider title='' showBorder={false} itemHeight={150} maxHeight={600}>
                        {infoCursos.map((info) => (
                            <CourseCard
                                key={info.id}
                                info={{
                                    id: info.id,
                                    images: info.images,
                                    title: info.titulo,
                                    startDate: info.start_date,
                                    endDate: info.end_date,
                                    minAge: info.min_age,
                                    location: null,
                                    price: info.price,
                                    level: info.level,
                                    images: info.images,
                                    business: true,
                                    total_revenue: 1000,
                                    num_reservations: 10,
                                }}
                                setCurrentCourse={() => handleEditCourse(info)}
                                setIsEditing={setIsEditing}
                            />
                        ))}
                    </CustomSlider>
                )}

                {/* <pre
                    style={{
                        backgroundColor: 'black',
                        padding: '10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        height: '200px',
                        overflowY: 'auto',
                    }}
                >{JSON.stringify(currentCourse, null, 2)}</pre> */}
            </div>

            {/* Right side - Form with Tabs */}
            {(isEditing || isCreating) && (
                <div className={styles.formPanel}>
                    <div className={styles.tabsContainer}>
                        <div style={{ height: '100%', display: 'flex', alignContent: 'end' }}>
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
                        <button className={styles.closeButton} onClick={handleCloseForm}>
                            <XIcon size={24} />
                        </button>
                    </div>

                    {activeTab === 'formulario' ? (
                        <div className={styles.formularioContainer}>
                            <CourseForm 
                                courseData={currentCourse}
                                setCourseData={setCurrentCourse}
                                state={state}
                                setState={setState}
                                fileImages={fileImages}
                                setFileImages={setFileImages}
                            />
                        </div>
                    ) : (
                        <form className={stylesCursos.turnosContenido} onSubmit={handleTurnoAddSubmit}>
                            <div className={stylesCursos.formTurnos}>
                                <div className={stylesCursos.formRow}>
                                    <div className={stylesCursos.formGroup}>
                                        <label className={stylesCursos.label}>Hora de inicio: </label>
                                        <input
                                            type="time"
                                            name="startTime"
                                            className={stylesCursos.input}
                                            value={TurnosFormData.startTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>  
                                    <div className={stylesCursos.formGroup}>
                                        <label className={stylesCursos.label}>Hora de fin: </label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            className={stylesCursos.input}
                                            value={TurnosFormData.endTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>  
                                </div>
                                <div className={stylesCursos.formRow}>
                                    <Days days={days} setDays={setDays} editing={true} />
                                    <HaramaraButton className={stylesCursos.buttonSave} type="submit">
                                        Añadir Turno +
                                    </HaramaraButton>
                                </div>
                            </div>
                            <div className={stylesCursos.turnosContainer}>
                                {turnos.map((turno) => (
                                    <TurnoCurso key={turno.id} turno={turno} />
                                ))}
                            </div>
                        </form>
                    )}

                    <div className={styles.footerPanel}>
                        <HaramaraButton 
                            className={styles.buttonSave} 
                            onClick={handleCourseSubmit}
                            disabled={!currentCourse && activeTab === 'formulario'}
                        >
                            {isEditing ? 'Guardar Cambios' : (isCreating ? 'Crear Curso' : 'Enviar Datos')}
                        </HaramaraButton>
                    </div>
                </div>
            )}
        </div>
    );
}