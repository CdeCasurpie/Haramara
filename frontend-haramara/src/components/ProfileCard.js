import styles from './ProfileCard.module.css';

export default function ProfileCard({ urlImage, name, role }) {
    if (!urlImage){
        urlImage = '/images/general/profile_default.svg';
    }
    return (
        <div className={styles.profileContainer}>
            <img src={urlImage} alt="profile" className={styles.profileImage} />
            <div className={styles.profileInfo}>
                <h1 className={styles.profileName}>{name}</h1>
                <p className={styles.profileRole}>{role}</p>
            </div>
        </div>
    );
}
