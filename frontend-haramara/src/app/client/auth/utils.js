import API_BASE_URL  from "@/config";


export const handleRegisterUser = async (formData, setFormData, setUser, setUserType, router) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.status === 201) {
            console.log("Usuario registrado", result);
            // loguearse automaticamente
            const dataNew = {email: formData.email, password: formData.password, type: "user"};

            handleLoginEspecific(dataNew, formData, setFormData, setUser, setUserType, router);
            
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
export const handleLoginEspecific = async (data, formData, setFormData, setUser, setUserType, router) => {
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
            const complete_data = await handleCurrentUser();
            console.log("todos me odian")
            console.log("complete_data", complete_data);
            setUser(complete_data);
            setUserType(complete_data.type);

            //redirigir a la página de inicio
            console.log("jaj")
            router.push("/client");
            console.log("holi")
            

        } else {
            console.error("Error logeando usuarioX", result);
            alert("Error logeando usuarioX");
        }

    } catch(error){
        console.error("Error logeando usuarioY", error);
        alert("Error logeando usuarioY");
    } 
};


const handleCurrentUser = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            credentials: "include",
        });

        const result = await response.json();

        if (response.status === 200) {
            console.log("Usuario actual", result);
            return result;
        } else {
            console.log("Error obteniendo usuario actual", result);
            console.error("Error obteniendo usuario actual", result);
        }

    } catch(error){
        console.error("Error obteniendo usuario actual", error);
    } 
}


