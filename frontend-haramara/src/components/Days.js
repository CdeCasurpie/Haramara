'use client';
import styles from './Days.module.css';

export default function Days({ days, setDays, editing }) {
    const daysNames = ["L", "M", "X", "J", "V", "S", "D"];

    const handleActivateDay = (index) => {
        if (!editing) return; 
        const newDays = [...days];
        newDays[index] = !newDays[index];
        setDays(newDays);
    };

    return (
        <div className={`${styles.container} ${editing ? styles.editing : ''}`}>
            {
                days.map((day, index) => 
                (
                    <div key={index} 
                        className={`${styles.circle} ${day ? styles.active : styles.inactive} ${editing ? styles.hoverEnabled : ''}`} 
                        onClick={() => handleActivateDay(index)}>
                        {daysNames[index]}
                    </div>
                ))
            }
        </div>
    );
}
