"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import styles from "./Calendar.module.css";

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

export default function CalendarSlider({ occupiedDays = [], selectedDay, setSelectedDay, zonaHoraria }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev + 1) % 12);
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev - 1 + 12) % 12);
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
    }
  };

  const handleSelectDay = (date) => {
    setSelectedDay(date.toLocaleDateString(zonaHoraria));
  };

  const daysArray = generateCalendarDays(currentYear, currentMonth);
  
  useEffect(() => {
    if (!selectedDay) {
      const nextFree = findNextFreeDay(occupiedDays, today, zonaHoraria);
      setSelectedDay(nextFree);
    }
  }, [occupiedDays, today, selectedDay, setSelectedDay]);

  return (
    <div className={styles.calendarSlider}>
    <button onClick={handlePrevMonth} className={styles.arrowButton}>
        <ChevronLeft size={20} />
    </button>
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <span className={styles.monthTitle}>
          {monthNames[currentMonth]} {currentYear}
        </span>
      </div>

      <hr style={{ width: "100%", margin: "8px 0", borderColor: "var(--primary-accent-color)", borderWidth: "0.5px" }} />
      <div className={styles.grid}>
        {dayNames.map((day) => (
          <div key={day} className={styles.dayCell} style={{ fontWeight: "bold" }}>
            {day}
          </div>
        ))}

        {daysArray.map((dayObj, index) => {
          const { date, isCurrentMonth } = dayObj;
          const dayNumber = date.getDate();
          const cellStyle = getCellStyle(date, today, isCurrentMonth, occupiedDays, selectedDay, zonaHoraria);

          return (
            <button key={index} onClick={() => handleSelectDay(date)} className={styles.dayButton}>
            <div key={index} className={styles.dayCell} style={cellStyle}>
              {dayNumber}
            </div>
            </button>
          );
        })}
      </div>
    </div>
    <button onClick={handleNextMonth} className={styles.arrowButton}>
        <ChevronRight size={20} />
    </button>
    </div>
  );
}

function generateCalendarDays(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  let startIndex = firstDayOfMonth.getDay();
  startIndex = startIndex === 0 ? 6 : startIndex - 1;

  const endIndex = lastDayOfMonth.getDay();
  let adjustedEndIndex = endIndex === 0 ? 6 : endIndex - 1;
  const daysInMonth = [];

  for (let i = 0; i < startIndex; i++) {
    const d = new Date(year, month, 0 - (startIndex - 1 - i));
    daysInMonth.push({ date: d, isCurrentMonth: false });
  }

  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    daysInMonth.push({ date: new Date(year, month, day), isCurrentMonth: true });
  }

  for (let i = 1; i <= 6 - adjustedEndIndex; i++) {
    const d = new Date(year, month + 1, i);
    daysInMonth.push({ date: d, isCurrentMonth: false });
  }

  return daysInMonth;
}

function findNextFreeDay(occupiedDays, today, zonaHoraria) {
    const todayStr = today.toLocaleDateString(zonaHoraria);
    // Si hoy no está ocupado, lo retornamos como el día más próximo
    if (!occupiedDays.includes(todayStr)) {
        return todayStr;
    }

    // Buscar el primer hueco libre después del primer ocupado encontrado
    let currentDate = new Date(today);
    while (true) {
        // Avanzamos un día
        currentDate.setDate(currentDate.getDate() + 1);
        const currentDateStr = currentDate.toLocaleDateString(zonaHoraria);

        // Si no está ocupado, lo retornamos
        if (!occupiedDays.includes(currentDateStr)) {
            return currentDateStr;
        }
    }
}   

function getCellStyle(date, today, isCurrentMonth, occupiedDays, selectedDay, zonaHoraria) {
  const baseStyle = {
    color: "black",
  };

  const dateKey = date.toLocaleDateString(zonaHoraria);

  if (selectedDay && dateKey === selectedDay && isCurrentMonth) {
    baseStyle.border = "2px solid var(--secondary-color)";
    baseStyle.borderRadius = "50%";
    baseStyle.aspectRatio = "1 / 1";
  }

  if (occupiedDays.includes(dateKey)) {
    baseStyle.color = "#EB4848";
  }

  if (date < removeTime(today)) {
    baseStyle.color = "gray";
  }

  if (!isCurrentMonth) {
    baseStyle.color = "transparent";
  }


  return baseStyle;
}

function removeTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
