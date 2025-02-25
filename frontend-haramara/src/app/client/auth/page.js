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
import { Calendar } from 'lucide-react';


import React, { useState } from "react";

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

  return (
    <>
    <ActivityBanner info={{ 
      imagesList: imageList,
      location: "Cusquito",
      title: "Actividad de prueba",
      minAge: 18,
      price: 100,
      stars: 4,    
    }} />
    </>

  );
}
