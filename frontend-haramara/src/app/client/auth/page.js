'use client';
import ActivityBanner from '@/components/ActivityBanner';
import ActivityCard from '@/components/ActivityCard';
import BusinessSideBar from '@/components/BusinessSideBar';
import CalendarSlider from '@/components/Calendar';
import CourseCard from '@/components/CourseCard';
import CustomInputLocation from '@/components/CustomInputLocation';
import CustomInputText from '@/components/CustomInputText';
import CustomSelect from '@/components/CustomSelect';
import Gallery from '@/components/Gallery';
import HaramaraButton from '@/components/HaramaraButton';
import NavBar from '@/components/NavBar';
import NavBarBusiness from '@/components/NavBarBusiness';
import ProfileCard from '@/components/ProfileCard';
import StarsRating from '@/components/Stars';
import Stars from '@/components/Stars';
import ProductCard from '@/components/ProductCard';
import { Calendar } from 'lucide-react';

import React, { useState } from "react";
import ActivityTurno from '@/components/ActivityTurno';

export default function Formulario() {
  const [occupiedDays, setOcupiedDays] = useState(["2025-02-24", "2025-02-26"]);
  const [selectedDay, setSelectedDay] = useState(null);
  const imageUrl = "/images/home/adultos.jpg";
  //    <CalendarSlider occupiedDays={occupiedDays} selectedDay={selectedDay} setSelectedDay={setSelectedDay} zonaHoraria="en-CA" />
  const imageList = [
    "/images/home/adultos.jpg",
    "/images/home/buceo.jpg",
    "/images/home/family.jpg",
    "/images/home/kids.jpg",
  ];

  // Datos de productos para prueba
  const sampleProducts = [
    {
      id: 1,
      imageUrl: "/images/home/buceo.jpg",
      title: "Equipo de buceo completo",
      price: 3600,
      discountPrice: 1256,
      ratings: 4.5,
      reviewCount: 124,
      inventory: 8
    },
    {
      id: 2,
      imageUrl: "/images/home/adultos.jpg",
      title: "Aletas de buceo profesionales",
      price: 450,
      discountPrice: null,
      ratings: 5,
      reviewCount: 87,
      inventory: 15
    },
    {
      id: 3,
      imageUrl: "/images/home/family.jpg",
      title: "Traje de neopreno 3mm",
      price: 890,
      discountPrice: 699,
      ratings: 4.0,
      reviewCount: 56,
      inventory: 3
    },
    {
      id: 4,
      imageUrl: "/images/home/kids.jpg",
      title: "Máscara de buceo con tubo",
      price: 280,
      discountPrice: null,
      ratings: 3.5,
      reviewCount: 42,
      inventory: 0
    }
  ];

  return (
    <div style={{width: '100%', padding: '20px', background: '#f0f4f8'}}>
      <h1 style={{ textAlign: 'center', margin: '30px 0', fontSize: '2rem', color: 'var(--primary-color)' }}>
        Componentes de prueba
      </h1>

      <div style={{ margin: '40px 0', padding: '20px', background: '#f5f7fa', borderRadius: '8px' }}>
        <h2 style={{ margin: '0 0 30px 0', fontSize: '1.5rem', color: 'var(--text-color)' }}>
          Tarjeta de Producto Individual
        </h2>
        <div style={{ maxWidth: '350px', margin: '0 auto' }}>
          <ProductCard 
            id={sampleProducts[0].id}
            imageUrl={sampleProducts[0].imageUrl}
            title={sampleProducts[0].title}
            price={sampleProducts[0].price}
            discountPrice={sampleProducts[0].discountPrice}
            ratings={sampleProducts[0].ratings}
            reviewCount={sampleProducts[0].reviewCount}
            inventory={sampleProducts[0].inventory}
          />
        </div>
      </div>

      <div style={{ margin: '40px 0', padding: '20px', width: "600px"}}>
          <ActivityTurno turno={{
            startTime: "10:00",
            endTime: "12:00",
            freeVacancies: 4,
          }} />
      </div>

      <ActivityBanner info={{ 
        imagesList: imageList,
        location: "Cusquito",
        title: "Actividad de prueba",
        minAge: 18,
        price: 100,
        stars: 4,    
      }} />
      <CalendarSlider occupiedDays={occupiedDays} selectedDay={selectedDay} setSelectedDay={setSelectedDay} zonaHoraria="en-CA" />
      
      <ActivityCard info={{
        id: 1,
        imagesList: imageList,
        title: "Actividad de prueba",
        location: "Cusquito",
        numReservations: 10,
        stars: 3.5,
        price: 100,
        onSubmit: () => console.log("reservar"),
      }} />

      <CourseCard info={{
        id: 1,
        images: [imageUrl],
        title: "Curso de prueba",
        startDate: "2025-02-24",
        endDate: "2025-02-26",
        minAge: 18,
        level: "Intermedio",
        location: "Cusquito",
        price: 100,
      }} />
    </div>
  );
}