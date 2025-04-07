'use client';
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./ActivityDetail.module.css";
import ActivityBanner from "@/components/ActivityBanner";
import Feature from "@/components/Feature";
import CalendarSlider from "@/components/Calendar";
import ActivityTurno from "@/components/ActivityTurno";
import Footer from "@/components/Footer";
import SimpleMap from "@/components/SimpleMap";

export default function ActivityDetail() {
  const params = useParams();
  const { id } = params; // Obtiene el parámetro dinámico
  const [selectedDay, setSelectedDay] = useState(null);
  const [turnos, setTurnos] = useState([]);
// id | id_service |  titulo   | ubicacion | price_per_person |  description   | features | min_age | initial_vacancies | tags
const data = {
    id: id,
    imagesList: [
      "/images/home/adultos.jpg",
      "/images/home/buceo.jpg",
      "/images/home/family.jpg",
      "/images/home/kids.jpg",
    ],
    //ubicacion es un json con lat, lng, address y full_address
    location: {
        lat: 40.4168,
        lng: -3.7038,
        address: "Gran Vía 28",
        full_address: "Gran Vía 28, Madrid, España"
    },    
    title: "Clase de Yoga",
    minAge: 18,
    price: 50,
    stars: 4.5,
    description: "Clase de yoga para todos los niveles. Mejora tu flexibilidad y bienestar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    features: {
        "Duración": "2 horas",
        "Equipamiento": "Colchoneta de yoga, bloques",
        "Servicios": "Instructor certificado, agua",
        "Nivel": "Principiante a avanzado",
        "Clima": "Soleado",
    },
    occupiedDays: ["2025-04-02", "2025-04-26"],
  }

  console.log("Activity ID:", id);

  useEffect(
    () => {
        console.log("Selected day pg:", selectedDay);
        //hacer un fetch de los turnos correspondientes a ese dia
        if (!selectedDay) return;
        
        setTurnos([
            {
                id: 1,
                startTime: "08:00",
                endTime: "10:00",
                freeVacancies: 5,
            },
            {
                id: 2,
                startTime: "10:00",
                endTime: "12:00",
                freeVacancies: 0,
            },
            {
                id: 3,
                startTime: "12:00",
                endTime: "14:00",
                freeVacancies: 2,
            },
        ]);
    }, [selectedDay]);



  return (
    <>
    <div className={styles.container}>
        <ActivityBanner info={{
            imagesList: data.imagesList,
            location: data.location.address,
            title: data.title,
            minAge: data.minAge,
            price: data.price,
            stars: data.stars
        }}/>

        <div className={styles.activityContent}>
            <div className={styles.activityDetails}>
                <div className={styles.apartado}>
                    Descripción:
                </div>
                {data.description}
                <div className={styles.apartado}>
                    Características:
                </div>
                <div className={styles.featuresContainer}>
                    {
                        Object.entries(data.features).map(([key, value]) => (
                            <Feature key={key} name={key} content={value} />
                        ))
                    }
                </div>
                <div className={styles.apartado}>
                    Ubicación:
                </div>
                <div className={styles.mapContainer}>
                    <SimpleMap location={{lat: data.location.lat, lng: data.location.lng}}/>
                </div>
                <div className={styles.fullLocation}>
                    {data.location.full_address}
                </div>
            </div>
            <div className={styles.turnosDetails}>
                <div className={styles.group}>
                    Elige una fecha disponible:
                    <div className={styles.calendarContainer}>
                        <CalendarSlider occupiedDays={data.occupiedDays} selectedDay={selectedDay} setSelectedDay={setSelectedDay} zonaHoraria="en-CA" />
                    </div>
                </div>
                <div className={styles.group}>
                    Turnos disponibles el {selectedDay}:
                    <div className={styles.turnosContainer}>
                        {
                            turnos.length > 0 ? (
                                turnos.map(turno => (
                                    <ActivityTurno key={turno.id} turno={turno} />
                                ))
                            ) : (
                                <div>No hay turnos disponibles para esta fecha.</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer/>
    </>
  );
}
