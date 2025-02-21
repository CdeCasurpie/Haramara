'use client';

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./layout.module.css";
import { AuthContext } from "./AuthContext";

export default function ClientAuthLayout({ children}) {
    const router = useRouter();
    const pathname = usePathname();
    const [path, setPath] = useState("");
    const [selected, setSelected] = useState("user");
    const [typeForm, setTypeForm] = useState("null");
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const path = window.location.pathname;
            if (path?.includes("register")) {
                setPath("register");
            } else if (path?.includes("login")) {
                setPath("login");
            }
        }
    }, [pathname]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (path === "register") {
                setTypeForm("register");
            } else if (path === "login") {
                setTypeForm("login");
            }

            setSelected("user");
        }
    }, [path]);

    // Redirigir cuando cambian selected
    useEffect(() => {
        console.log("typeForm", typeForm, "selected", selected);
        if (typeForm !== "null") {

            let newPath;
            if (typeForm === "register") {
                newPath = `/client/auth/${typeForm}-${selected}`;
            }else{
                newPath = `/client/auth/${typeForm}`;
            }
            router.push(newPath);
        }
    }, [selected]);


    return (
        <AuthContext.Provider value={{ selected, setSelected, formData, setFormData }}>
            <div className={styles.container}>
                <div className={styles["toggle-container"]}>
                    <button
                        className={`${styles["toggle-button"]} ${selected === "user" ? styles.active : ""}`}
                        onClick={() => setSelected("user")}
                    >
                        USUARIO
                    </button>
                    <button
                        className={`${styles["toggle-button"]} ${selected === "company" ? styles.active : ""}`}
                        onClick={() => setSelected("company")}
                    >
                        EMPRESA
                    </button>
                </div>
                {children}
            </div>
        </AuthContext.Provider>
    );
}
