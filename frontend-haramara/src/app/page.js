'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const HomePage = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/client');
        }, 1000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className={styles.container}>
            <h1 className={styles.text + " amiri-light"}>HARAMARA</h1>
            <div className={styles.dotsContainer}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
            </div>
        </div>
    );
};

export default HomePage;