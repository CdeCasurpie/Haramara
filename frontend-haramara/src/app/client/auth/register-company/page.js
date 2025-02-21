'use client';
import AuthForm from "@/components/AuthForm";
import { handleRegisterCompany } from "../utils";

export default function RegisterCompany() {
    const registerComapnyFields = [
        { name: "name", type: "text", placeholder: "Nombre de la empresa", label: "Nombre de la empresa:" },
        { name: "email", type: "email", placeholder: "example@gmail.com", label: "Correo electrónico:" },
        { name: "name_representative", type: "text", placeholder: "Nombre del representante", label: "Nombre del representante:" },
        { name: "last_name_representative", type: "text", placeholder: "Apellido del representante", label: "Apellido del representante:"},
        { name: "password", type: "password", placeholder: "contraseña", label: "Contraseña:" },
        { name: "address", type: "text", placeholder: "Dirección", label: "Dirección:" },
        { name: "country", type: "text", placeholder: "País", label: "País:" },
        { name: "comunity", type: "text", placeholder: "Comunidad", label: "Comunidad:" },
        { name: "province", type: "text", placeholder: "Provincia", label: "Provincia:" },
        { name: "postal_code", type: "text", placeholder: "Código postal", label: "Código postal:" },
        { 
            name: "has_languages", 
            type: "radio", 
            label: "¿Hablas otros idiomas?", 
            options: [
                { value: "si", label: "Sí" },
                { value: "no", label: "No" }
            ] 
        },
        { 
            name: "is_safe", 
            type: "radio", 
            label: "¿Cumple las condiciones legales españolas?", 
            options: [
                { value: "si", label: "Sí" },
                { value: "no", label: "No" }
            ] 
        }
        
    ];

    return <AuthForm title="Registro de Empresa" message="Crea una cuenta para empezar a promocionar tu empresa." fields={registerComapnyFields} onSubmit={handleRegisterCompany}>

    </AuthForm> 
}