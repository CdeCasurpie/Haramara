'use client';
import BusinessSideBar from '@/components/BusinessSideBar';
import CustomInputLocation from '@/components/CustomInputLocation';
import CustomInputText from '@/components/CustomInputText';
import CustomSelect from '@/components/CustomSelect';
import HaramaraButton from '@/components/HaramaraButton';
import NavBar from '@/components/NavBar';
import NavBarBusiness from '@/components/NavBarBusiness';
import ProfileCard from '@/components/ProfileCard';


import React, { useState } from "react";

export default function Formulario() {
  const [hablaIngles, setHablaIngles] = useState(null);

  return (
    <>
    hola
    <ProfileCard url_image="/images/imagen.jpg" name="Nombre" role="Vendedor"/>
    </>
  );
}
