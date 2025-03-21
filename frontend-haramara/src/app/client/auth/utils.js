import API_BASE_URL  from "@/config";


export const handleRegisterUser = async (formData, setFormData, setUser, setUserType, router, setErrors, setSuccess) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.status === 201) {

            const dataNew = {email: formData.email, password: formData.password, type: "user"};
            handleLoginEspecific(dataNew, setFormData, setUser, setUserType, router, setErrors, setSuccess);
            
            setFormData(
                {}
            )

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        } else {
            if (!result.success) {
                let errors = [result.message];

                if (result.missing) {
                    for (const field of result.missing) {
                        errors.push(`El campo ${field} es requerido`);
                    }
                }
                setSuccess(false);
                setErrors(errors);
            }
        }

    } catch(error){
        console.error("Error registrando usuario", error);
    } 
};

export const handleRegisterCompany = async (formData, setFormData, setUser, setUserType, router, setErrors, setSuccess) => {
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
                "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.status === 201) {
            setFormData(
                {}
            )
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 5000);

        } else {
            if (!result.success) {
                let errors = [result.message];

                if (result.missing) {
                    for (const field of result.missing) {
                        errors.push(`El campo ${field} es requerido`);
                    }
                }
                setSuccess(false);
                setErrors(errors);
            }
        }
    } catch(error){
        console.error("Error registrando empresa", error);
    }  
};
export const handleLoginEspecific = async (formData, setFormData, setUser, setUserType, router, setErrors, setSuccess) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            mode: "cors",
            credentials: "include",
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.status === 200) {
            setFormData(
                {}
            )

            const complete_data = await handleCurrentUser();

            setUser(complete_data);
            setUserType(complete_data.type);

            router.push("/client");

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        } else {
            if (!result.success) {
                let errors = [result.message];

                if (result.missing) {
                    for (const field of result.missing) {
                        errors.push(`El campo ${field} es requerido`);
                    }
                }
                setSuccess(false);
                setErrors(errors);
            }
        }

    } catch(error){
        console.error("Error logeando usuario", error);
    } 
};


const handleCurrentUser = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            mode: "cors",
            credentials: "include",
        });

        const result = await response.json();

        if (response.status === 200) {
            return result;
        } else {
            console.error("Error obteniendo usuario actual", result);
        }

    } catch(error){
        console.error("Error obteniendo usuario actual", error);
    } 
}


export const handleLogout = async (setUser, setUserType, router) => {
    setUser(null);
    setUserType(null);

    fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
        },
        mode: "cors",
        credentials: "include",
    }).then(() => {
        if (typeof window !== "undefined") {
            window.location.href = "/client";
        }
    })
}