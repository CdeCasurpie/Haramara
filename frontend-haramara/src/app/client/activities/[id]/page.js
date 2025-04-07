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
import { fetchActivityDetails, fetchTurnosPerYear } from "./utils";
import { h } from "vue";

export default function ActivityDetail() {
  const params = useParams();
  const { id } = params; // Obtiene el parámetro dinámico
  const [selectedDay, setSelectedDay] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [data, setData] = useState(null);
  const [hashOccupiedDays, setHashOccupiedDays] = useState({});
  const [HashTurnosPerYear, setHashTurnosPerYear] = useState({});
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [loadingTurnos, setLoadingTurnos] = useState(true);
  const [loadingData, setLoadingData] = useState(true);


  // Traemos la data y los turnos del año al cargar la pagina
  useEffect(() => {
    const fetchInfoData = async () => {
        setLoadingData(true);
        try {
            // Simulando la carga de datos
            console.log("Fetching data for activity ID:", id);
            const data = await fetchActivityDetails(id); 
            console.log("Data:", data);
            if (data) {
                setData(data);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoadingData(false);
        }
    }

    fetchInfoData();

  }, []);

  useEffect(() => {
    const fetchInfoTurnosPerYear = async () => {
        if (HashTurnosPerYear[currentYear]) return;

        setLoadingTurnos(true);
        setLoadingCalendar(true);
        try {
            const data = await fetchTurnosPerYear(id, currentYear);
            if (data) {
                setHashTurnosPerYear((prev) => ({
                    ...prev,
                    [currentYear]: data.shifts,
                }));

                console.log("Turnos:", data.shifts);

                setHashOccupiedDays((prev) => ({
                    ...prev,
                    [currentYear]: data.occupied_days,
                }));
                console.log("Occupied days:", data.occupied_days);
            }
        } catch (error) {
            console.error("Error loading turnos:", error);
        } finally {
            setLoadingCalendar(false);
        }
    }
    fetchInfoTurnosPerYear();
  }, [currentYear]);


  console.log("Activity ID:", id);

  useEffect(
    () => {
        console.log("Selected day pg:", selectedDay);
        //hacer un fetch de los turnos correspondientes a ese dia
        setLoadingTurnos(true);
        if (!selectedDay || !HashTurnosPerYear[currentYear]) return;

        setTurnos(HashTurnosPerYear[currentYear][selectedDay] || []);
        
        setLoadingTurnos(false);
        console.log("Turnos:", HashTurnosPerYear[currentYear][selectedDay]);
    }, [selectedDay]);

return (
    <>
    <div className={styles.container}>
        {
            loadingData ? (
            <div className={styles.loading}>
                Cargando datos de la actividad...
            </div> ) :
            (
            <>
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
                           data.features.map((feature, index) => (
                            <Feature key={index} name={feature.name} content={feature.value} />
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
                        {
                            loadingCalendar ? (
                                <div className={styles.loading}>
                                    Cargando calendario...
                                </div>
                            ) : (
                                <div className={styles.calendarContainer}>
                                    <CalendarSlider occupiedDays={hashOccupiedDays[currentYear] || []} selectedDay={selectedDay} setSelectedDay={setSelectedDay} zonaHoraria="en-CA" currentYear={currentYear} setCurrentYear={setCurrentYear} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
                                </div>
                            )
                        }
                    </div>
                    <div className={styles.group}>
                        Turnos disponibles el {selectedDay}:
                        {
                            loadingTurnos ? (
                                <div className={styles.loading}>
                                    Cargando turnos...
                                </div>
                            ) :
                            (
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
                            )
                        }
                    </div>
                </div>
            </div>
            </>
            )
        }
    </div>
    <Footer/>
    </>
  );
}
