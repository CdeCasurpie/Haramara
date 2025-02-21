'use client';
import BusinessSideBar from '@/components/BusinessSideBar';
import CustomInputLocation from '@/components/CustomInputLocation';
import CustomInputText from '@/components/CustomInputText';
import CustomSelect from '@/components/CustomSelect';
import HaramaraButton from '@/components/HaramaraButton';
import NavBar from '@/components/NavBar';
import NavBarBusiness from '@/components/NavBarBusiness';


import React, { useState } from "react";

export default function Formulario() {
  const [hablaIngles, setHablaIngles] = useState(null);

  return (
    <form>
      <label>¿Hablas inglés?</label>
      <div>
        <label>
          <input
            type="radio"
            name="ingles"
            value="si"
            checked={hablaIngles === "si"}
            onChange={() => setHablaIngles("si")}
          />
          Sí
        </label>

        <label>
          <input
            type="radio"
            name="ingles"
            value="no"
            checked={hablaIngles === "no"}
            onChange={() => setHablaIngles("no")}
          />
          No
        </label>
      </div>
    </form>
  );
}
