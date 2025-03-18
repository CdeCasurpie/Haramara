"use client";

import CourseCard from "@/components/CourseCard";
import CourseForm from "../business-components/CourseForm";
import Days from "@/components/Days";
import TurnoCurso from "@/components/TurnoCurso";
import styles from './Cursos.module.css';
import { useEffect, useState } from 'react';
import HaramaraButton from '@/components/HaramaraButton';
import { Car, XIcon } from 'lucide-react';
import { fetchCourses, createCourse } from './utils';

export default function Cursos() {
    const [activeTab, setActiveTab] = useState('formulario');
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(true);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [courseData, setCourseData] = useState(null);
    //const [infoCursos, setInfoCursos] = useState([]);
    const [state, setState] = useState(() => {
        if(isCreating){
            return "creating";
        }else if(isEditing){
            return "editing";
        }else{
            return "normal";
        }
    });
    const [turnos, setTurnos] = useState(
        [
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
        ]
    );
    const [TurnosFormData, setTurnosFormData] = useState({
        startTime: '',
        endTime: '',
        days: [false, false, false, false, false, false, false],
    });
    const [newTurnos, setNewTurnos] = useState([]);
    const [infoCursos, setInfoCursos] = useState(null);
    const [loading, setLoading] = useState(true);


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


    const handleCourseSubmit = async (courseData) => {
        console.log("Datos del curso enviados:", courseData);
        if (isCreating) {
            try {
                const newCourse = await createCourse(courseData);
                console.log("Curso creado:", courseData);
                /*
                - title
                - price
                - startDate
                - endDate
                - message
                - description
                - tags
                - vacancies
                - location
                - images
                - minAge
                - images
                */
               
                    
            } catch (error) {
                console.error("Error en createActivity:", error);
            }
        } else if (isEditing) {
            console.log("Editando curso");
        }

        // creando turnos de golpe
        console.log("Turnos a crear", newTurnos);

        // limpiando datos
        /*
        setCourseData(null);
        setNewTurnos([]);
        setIsEditing(false);
        setIsCreating(false);
        setCurrentCourse(null);
        setActiveTab('formulario');
        setState("normal");
        */
        
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleInputChange = (e) => {
        setTurnosFormData(
            {
                ...TurnosFormData,
                [e.target.name]: e.target.value
            }
        )
    }

    const handleTurnoAddSubmit = (e) => {
        e.preventDefault();
        console.log("Añadir turno", TurnosFormData);
        setTurnos([...turnos, {
            id: turnos.length + 1,
            courseId: 1,
            startTime: TurnosFormData.startTime,
            endTime: TurnosFormData.endTime,
            initialDays: days,
            numReservations: 0,
            handleStudents: () => console.log("Ver alumnos"),
        }]);
        setNewTurnos([...newTurnos, {
            id_course: currentCourse.id,
            start_time: TurnosFormData.startTime,
            end_time: TurnosFormData.endTime,
            frequency: days,
        }]);
    }

    const handleCreateCourse = () => {
        setIsEditing(false);
        setCurrentCourse(null);
        setIsCreating(true);
        setActiveTab('formulario');
    }
/*
    images: '',
    title: '',
    startDate: '',
    endDate: '',
    price: '',
    message: '',
    location: '',
    description: '',
    minAge: '',
    vacancies: '',
    tags: '',
*/

    const [days, setDays] = useState([false, false, false, false, false, false, false]);

    return (
        <div className={styles.container}> 
            <div style={{ display: 'flex', flexDirection: 'column' }}>  
                <div className={styles.formRow} style={{padding: "0rem 2.5rem"}} >
                    <div style = {{fontSize: '1.3rem', fontWeight: '400', marginBottom: '1rem', color: 'black'}}>
                    Cursos Creados:
                    </div>
                    <div styles={{width: 'auto'}}>
                        <HaramaraButton className={styles.buttonSave} onClick={handleCreateCourse} variant="principal">
                            + Crear nuevo curso
                        </HaramaraButton>
                    </div>
                </div>
                {
                    loading ? (
                        <p>Cargando cursos...</p>
                    ) : (
                        <>
                        {infoCursos.map((info) => {
                            return (<CourseCard
                            key={info.id}
                            info={
                                {
                                    id: info.id,
                                    images: info.images,
                                    title: info.titulo,
                                    startDate: info.start_date,
                                    endDate: info.end_date,
                                    minAge: info.min_age,
                                    location: null,
                                    price: info.price,
                                    level: info.level,
                                    business: true,
                                    total_revenue: 1000,
                                    num_reservations: 10,
                                }
                            }
                            setCurrentCourse={setCurrentCourse}
                            setIsEditing={setIsEditing}
                            />)
                        })}

                        </>
                    )
                }


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
                        <div className={styles.formularioContainer}>
                            <CourseForm onSubmit={handleCourseSubmit} 
                                initialData={
                                    currentCourse ? {
                                        id: currentCourse.id,
                                        title: currentCourse.title,
                                        startDate: currentCourse.startDate,
                                        endDate: currentCourse.endDate,
                                        price: currentCourse.price,
                                        message: currentCourse.message,
                                        location: currentCourse.location,
                                        images: currentCourse.images,
                                        description: currentCourse.description,
                                        minAge: currentCourse.minAge,
                                        vacancies: currentCourse.vacancies,
                                        tags: currentCourse.tags,
                                    } : undefined
                                }
                                setCourseData={setCourseData}
                                state={state}
                                setState={setState}
                            />
                        </div>
                    ) : (
                        <form className={styles.turnosContenido} onSubmit={handleTurnoAddSubmit}>
                        <div className={styles.formTurnos}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Hora de inicio: </label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        className={styles.input}
                                        value={TurnosFormData.startTime}
                                        onChange={handleInputChange}
                                        placeholder="Mensaje adicional"
                                        required
                                    />
                                </div>  
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Hora de fin: </label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        className={styles.input}
                                        value={TurnosFormData.endTime}
                                        onChange={handleInputChange}
                                        placeholder="Mensaje adicional"
                                        required
                                    />
                                </div>  
                            </div>
                            <div className={styles.formRow}>
                            <Days days={days} setDays={setDays} editing={true} />
                            <HaramaraButton className={styles.buttonSave} type="submit">
                                Añadir Turno +
                            </HaramaraButton>
                            </div>
                        </div>
                        <div className={styles.turnosContainer}>
                            {
                                turnos.map((turno) => (
                                    <TurnoCurso key={turno.id} turno={turno} />
                                ))
                            }
                        </div>
                        </form>
                    )
                }

                <div className={styles.footerPanel}>
                    <HaramaraButton className={styles.buttonSave} onClick={() => handleCourseSubmit(courseData)}>
                        {isEditing ? 'Guardar Cambios' : (isCreating ? 'Crear Curso' : 'Enviar Datos')}
                    </HaramaraButton>
                </div>
            </div>
            </div>
        </div>
    );
}
