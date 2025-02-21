import React, { useState } from "react";
import HaramaraButton from "./HaramaraButton";
import styles from "./AuthForm.module.css";

export default function AuthForm({ title, message, fields, onSubmit, children }) {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <h2 className={styles.title}>{title}</h2>
            <h3 className={styles.message}>{message}</h3>

            <div className={styles.inputContainer}>
                {fields.map((field) => (
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
                                placeholder={field.placeholder}
                                className={styles.input}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    )
                ))}
            </div>

            {children}

            <div className={styles.separator}>
                <HaramaraButton variant="principal" type="submit">
                    INICIAR SESIÓN
                </HaramaraButton>
            </div>
        </form>
    );
}
