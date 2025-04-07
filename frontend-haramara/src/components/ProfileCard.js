import { useState, useEffect } from 'react';
import styles from './ProfileCard.module.css';
import API_BASE_URL from '@/config';

export default function ProfileCard({ urlImage, name, role }) {
    const defaultImage = '/images/general/profile_default.svg';
    const [imgSrc, setImgSrc] = useState(defaultImage);
    const [imageLoadAttempt, setImageLoadAttempt] = useState(0);
    
    useEffect(() => {
        if (urlImage) {
            setImageLoadAttempt(1); // Primer intento con la URL original
            setImgSrc(urlImage);
        }
    }, [urlImage]);
    
    const handleImageError = () => {
        if (imageLoadAttempt === 1 && urlImage) {
            // Si el primer intento falló, intentar con API_BASE_URL + urlImage
            setImageLoadAttempt(2);
            setImgSrc(`${API_BASE_URL}${urlImage.startsWith('/') ? '' : '/'}${urlImage}`);
        } else {
            // Si también falló el segundo intento o no hay URL, usar imagen por defecto
            setImageLoadAttempt(3);
            setImgSrc(defaultImage);
        }
    };
    
    return (
        <div className={styles.profileContainer}>
            <img 
                src={imgSrc} 
                alt="profile" 
                className={styles.profileImage} 
                onError={handleImageError}
            />
            <div className={styles.profileInfo}>
                <h1 className={styles.profileName}>{name}</h1>
                <p className={styles.profileRole}>{role}</p>
            </div>
        </div>
    );
}
