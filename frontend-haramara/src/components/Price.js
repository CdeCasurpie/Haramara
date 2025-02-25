import styles from './Price.module.css';

export default function Price({ price }) {
    return (    
    <div className={styles.price}>
        <div className={styles.top}>
            desde
            <h1>{price} € </h1>
        </div>
        <div className={styles.bottom}>
            precio/persona
        </div>
    </div>
    );
}