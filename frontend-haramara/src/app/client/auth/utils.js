import API_BASE_URL  from "@/config";

export const handleRegisterUser = async (formData, setFormData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.status === 201) {
            console.log("Usuario registrado", result);
            alert("Usuario registrado");
            setFormData(
                {}
            )
        } else {
            console.error("Error registrando usuario", result);
            alert("Error registrando usuario");
        }

    } catch(error){
        console.error("Error registrando usuario", error);
        alert("Error registrando usuario");
    } 
};

export const handleRegisterCompany = async (formData, setFormData) => {  
    if(formData.has_languages === "si"){
        formData.has_languages = true;
    }else{
        formData.has_languages = false;
    }

    if(formData.is_safe === "si"){
        formData.is_safe = true;
    }
    else{
        formData.is_safe = false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register/company/temporal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.status === 201) {
            console.log("Empresa registrada", result);
            alert("Empresa registrada");
            setFormData(
                {}
            )
        } else {
            console.error("Error registrando empresa", result);
            alert("Error registrando empresa");
        }

    } catch(error){
        console.error("Error registrando empresa", error);
        alert("Error registrando empresa");
    }  
};

export const handleLoginEspecific = async (data, formData, setFormData) => {
    try {
        console.log("data amarilla", data);
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            credentials: "include",
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.status === 200) {
            console.log("Usuario logeado", result);
            alert("Usuario logeado");
            setFormData(
                {}
            )
            
        } else {
            console.error("Error logeando usuario", result);
            alert("Error logeando usuario");
        }

    } catch(error){
        console.error("Error logeando usuario", error);
        alert("Error logeando usuario");
    } 
};



