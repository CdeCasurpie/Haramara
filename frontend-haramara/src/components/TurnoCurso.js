'use client';
import { useState } from 'react';
import Days from './Days';
import styles from './TurnoCurso.module.css';
import Image from 'next/image';
import { CheckCircle } from 'react-bootstrap-icons';
import { DeleteIcon } from 'lucide-react';

export default function TurnoCurso({turno}) {
    /*
    {
        id,
        startTime,
        endTime,
        initialDays,
        numReservations,
        handleStudents
    }
    */
    const [days, setDays] = useState(turno.initialDays);
    const handleConfirmTurno = () => {
        console.log("Confirmar turno", days);
    };

    const handleDeleteTurno = (id) => {
        console.log("Eliminar turno", id);
    };

    return (
        <div className={styles.container}>
            <div className={styles.hours}>
                {turno.startTime} - {turno.endTime}
            </div>
            <div className={styles.details}>
                <Days days={days} setDays={setDays}/>
                <div className={styles.right}>
                    {turno.numReservations} reservas realizadas
                    <div className={styles.students} onClick={turno.handleStudents}>
                        ver alumnos
                    </div>
                </div>
            </div>
        </div>
    );
}