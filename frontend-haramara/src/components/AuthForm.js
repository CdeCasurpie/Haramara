import React, { useState, useEffect } from "react";
import HaramaraButton from "./HaramaraButton";
import styles from "./AuthForm.module.css";
import { useAuth } from "@/app/client/auth/AuthContext";
import { useUser } from "@/app/UserContext";
import { useRouter } from "next/navigation";

export default function AuthForm({
  title,
  message,
  fields,
  onSubmit,
  textButton,
  children,
  success,
  setSuccess,
}) {

    const router = useRouter();
    const {setUser,setUserType} = useUser();
    const { formData, setFormData } = useAuth();
    const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setErrors([]);
    e.preventDefault();
    await onSubmit(formData, setFormData, setUser, setUserType, router, setErrors, setSuccess);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2 className={styles.title}>{title}</h2>
      <h3 className={styles.message}>{message}</h3>

      <div className={styles.inputContainer}>
        {fields.map((field) =>
          field.type === "radio" ? (
            <div key={field.name} className={styles.selectorContainer}>
              <label className={styles.labelSelect}>{field.label}</label>
              <div className={styles.selector}>
                {field.options.map((option) => (
                  <label key={option.value} className={styles.labelSelect}>
                    <input
                      className={styles.inputSelect}
                      type="radio"
                      name={field.name}
                      value={option.value}
                      checked={formData[field.name] === option.value}
                      onChange={handleChange}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <label key={field.name} className={styles.label}>
              {field.label}
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                placeholder={field.placeholder}
                className={styles.input}
                onChange={handleChange}
                required
              />
            </label>
          )
        )}
      </div>

      {children}

      {/* Errores list */}
      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((error) => (
            <p key={error} className={styles.error}>
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Separator */}
      <div className={styles.separator}>
        <HaramaraButton variant={success ? "success" : "primary"} type="submit">
          {success ? "¡Listo!" : textButton || "Enviar"}
        </HaramaraButton>
      </div>
    </form>
  );
}
