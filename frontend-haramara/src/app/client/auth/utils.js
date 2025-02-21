import API_BASE_URL  from "@/config";

export const handleRegisterUser = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.status === 201) {
            console.log("Usuario registrado", result);
            alert("Usuario registrado");
        } else {
            console.error("Error registrando usuario", result);
            alert("Error registrando usuario");
        }

    } catch(error){
        console.error("Error registrando usuario", error);
        alert("Error registrando usuario");
    } 
};

export const handleRegisterCompany = async (data) => {  
    if(data.has_languages === "si"){
        data.has_languages = true;
    }else{
        data.has_languages = false;
    }

    if(data.is_safe === "si"){
        data.is_safe = true;
    }
    else{
        data.is_safe = false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register/company/temporal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.status === 201) {
            console.log("Empresa registrada", result);
            alert("Empresa registrada");
        } else {
            console.error("Error registrando empresa", result);
            alert("Error registrando empresa");
        }

    } catch(error){
        console.error("Error registrando empresa", error);
        alert("Error registrando empresa");
    }  
};

export const handleLoginEspecific = async (data) => {
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

        } else {
            console.error("Error logeando usuario", result);
            alert("Error logeando usuario");
        }

    } catch(error){
        console.error("Error logeando usuario", error);
        alert("Error logeando usuario");
    } 
};



