"use client";

import CourseCard from "@/components/CourseCard";
import CourseForm from "../business-components/CourseForm";
import Days from "@/components/Days";
import TurnoCurso from "@/components/TurnoCurso";
import styles from './Cursos.module.css';
import { useEffect, useState } from 'react';
import HaramaraButton from '@/components/HaramaraButton';
import { XIcon } from 'lucide-react';

export default function Cursos() {
    const [activeTab, setActiveTab] = useState('formulario');
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);

    useEffect(() => {
        if (isEditing) {
            console.log("Editando curso", currentCourse);
        }
    }, [currentCourse]);

    const handleCourseSubmit = (courseData) => {
        console.log("Datos del curso enviados:", courseData);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleInputChange = (e) => {
        console.log(e.target.value);
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
    
    const infoCursos = [
        {
            id: 1,
            imagesList: [],
            title: "curso de natacion",
            startDate: "2025-02-24",
            endDate: "2025-02-26",
            price: 100,
            message: "Principiante",
            location: "Cusquito",
            description: "Aprende a nadar con los mejores",
            minAge: 18,
            business: true,
            total_revenue: 1500,
            num_reservations: 10,
            tags: "#natacion #deporte #agua",
        },
        {
            id: 2,
            imagesList: [],
            title: "Curso de prueba",
            startDate: "2025-02-24",
            endDate: "2025-02-26",
            price: 100,
            message: "Principiante",
            location: "Cusquito",
            description: "Aprende a nadar con los mejores",
            minAge: 18,
            business: true,
            total_revenue: 1500,
            num_reservations: 10,
            tags: "#natacion #deporte #agua",
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
        <div className={styles.container}>
            oli
        </div>
    )
}
