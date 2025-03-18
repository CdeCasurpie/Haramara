'use client';
import { useState } from 'react';
import Days from './Days';
import styles from './TurnoCurso.module.css';
import Image from 'next/image';
import { CheckCircle } from 'react-bootstrap-icons';

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
    const [editing, setEditing] = useState(false);

    const handleConfirmTurno = () => {
        console.log("Confirmar turno", days);
    };

    return (
        <div className={styles.container}>
            <div className={styles.hours}>
                {turno.startTime} - {turno.endTime}
            </div>
            <div className={styles.details}>
                <Days days={days} setDays={setDays} editing={editing} />
                <div className={styles.editContainer} onClick={() => setEditing(!editing)}>
                    {
                        editing ? 
                        (
                            <CheckCircle size={15} color="green" onClick={handleConfirmTurno} />
                        ) : (
                            <Image
                                src="/images/general/edit.svg"
                                alt="Editar"
                                width={15}
                                height={15}
                            />
                        )
                    }
                </div>
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