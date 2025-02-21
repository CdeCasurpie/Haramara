'use client';
import AuthForm from "@/components/AuthForm";
import { handleRegisterUser } from "../utils";

export default function RegisterUser() {

    const loginFields = [
        { name: "username", type: "text", placeholder: "Nombre", label: "Nombre" },
        { name: "email", type: "email", placeholder: "Correo", label: "Correo" },
        { name: "password", type: "password", placeholder: "Contraseña", label: "Contraseña" },
        { name: "password2", type: "password", placeholder: "Repite tu contraseña", label: "Repite tu contraseña" }
    ];

    return <AuthForm title="Registro de Usuario" message="Crea una cuenta personal." fields={loginFields} onSubmit={handleRegisterUser} />
}