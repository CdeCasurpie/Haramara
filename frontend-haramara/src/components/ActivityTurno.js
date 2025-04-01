import React from "react";
import styles from "./ActivityTurno.module.css";
import HaramaraButton from "./HaramaraButton";

export default function ActivityTurno({ turno }) {
    const isDisabled = turno.freeVacancies <= 0;

    const handleReservar = () => {
        console.log("Reservar", turno.id);
    }

    return (
        <div className={`${styles.container} ${isDisabled ? styles.disabled : ""}`}>
            <div className={styles.left}>
                <div>
                    {turno.startTime} - {turno.endTime}
                </div>
                {
                    isDisabled ? (
                        <div className={styles.soldOut}>
                            AGOTADO
                        </div>
                    ) : (
                        <div className={styles.available}>
                            {turno.freeVacancies} CUPOS RESTANTES
                        </div>
                    )
                }
            </div>
            <div className={styles.right}>
                <div className={styles.formGroup}>
                    <label>N° de cupos:</label>
                    <input 
                        type="number" 
                        min="1" 
                        max={turno.freeVacancies} 
                        defaultValue={1} 
                        className={styles.input} 
                        disabled={isDisabled} 
                    />
                </div>
                <HaramaraButton
                    onClick={handleReservar}
                    className={`${styles.button} ${isDisabled ? styles.disabledButton : ""}`}
                >
                    Reservar
                </HaramaraButton>
            </div>
        </div>
    );
}
