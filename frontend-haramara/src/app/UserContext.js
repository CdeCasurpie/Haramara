"use client";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const useUser = () => {
    return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();

        const handleStorageChange = (event) => {
            if (event.key === "auth_token" && !event.newValue) {
                console.log("Auth token eliminado en otra pestaña. Refrescando datos...");
                fetchUserData();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch("/auth/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            if (!response.code === 200) {
                throw new Error("Error obteniendo usuario");
            }

            const data = await response.json();
            setUser(data["id"]);
            setUserType(data["type"]);
        } catch (error) {
            console.error("Error obteniendo usuario:", error);
            setUser(null);
            setUserType(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, userType, setUserType, loading }}>
            {children}
        </UserContext.Provider>
    );
};
