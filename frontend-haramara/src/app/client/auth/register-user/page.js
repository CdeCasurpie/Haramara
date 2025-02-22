'use client';
import AuthForm from "@/components/AuthForm";
import { handleRegisterUser } from "../utils";
import { useUser } from "@/app/UserContext";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";


export default function RegisterUser() {
    const router = useRouter();
    const {setFormData} = useAuth();
    const {setUser,setUserType} = useUser();

    const loginFields = [
        { name: "username", type: "text", placeholder: "Nombre", label: "Nombre" },
        { name: "email", type: "email", placeholder: "Correo", label: "Correo" },
        { name: "password", type: "password", placeholder: "Contraseña", label: "Contraseña" },
        { name: "password2", type: "password", placeholder: "Repite tu contraseña", label: "Repite tu contraseña" }
    ];

    const handlePreRegisterUser = async (data) => {
        handleRegisterUser(data, setFormData, setUser, setUserType, router);
    };
    return <AuthForm title="Registro de Usuario" message="Crea una cuenta personal." fields={loginFields} onSubmit={handlePreRegisterUser} textButton="REGISTRAR CUENTA" />
}