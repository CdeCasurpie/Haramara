'use client';
import AuthForm from "@/components/AuthForm";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";
import { handleLoginEspecific } from "../utils";
import { useUser } from "@/app/UserContext";
import { useRouter } from "next/navigation";


export default function Login() {
    const router = useRouter();
    const {selected, setSelected, formData, setFormData} = useAuth();
    const {user, setUser, userType, setUserType} = useUser();
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (selected === "user") {
            setTitle("");
        } else if (selected === "company") {
            setTitle(" empresarial");
        }
    }, [selected]);

    console.log("selected", selected);
    const loginFields = [   
        { name: "email", type: "email", placeholder: "example@gmail.com", label: "Correo electrónico:" },
        { name: "password", type: "password", placeholder: "contraseña", label: "Contraseña:" },
    ];


    const handleLogin = async (data) => {
        data.type = selected;
        console.log("data", data);
        handleLoginEspecific(data, formData, setFormData, setUser, setUserType, router);
    };

    return <AuthForm title={`Inicia sesión${title}`} message="Ingresa tus credenciales para acceder a tu cuenta." fields={loginFields} onSubmit={handleLogin} textButton="INICIAR SESIÓN" />
}