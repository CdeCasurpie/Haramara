"use client";
import NavBar from "@/components/NavBar";
import React, { useState, useEffect } from "react";
import styles from './layout.module.css'; 

export default function ClientLayout({ children }) {
    const [isNavBarFixed, setNavBarFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setNavBarFixed(true);
            } else {
                setNavBarFixed(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <NavBar />

            {isNavBarFixed && (
                <div className={styles.fixedNavBar}>
                    <NavBar />
                </div>
            )}
            {children}
        </>
    );
}