import Link from 'next/link';
import Image from 'next/image';
import styles from './ActivityCard.module.css';

const ActivityCard = ({ imageUrl, color, text, href }) => {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={text}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div 
          className={styles.overlay}
          style={{ backgroundColor: color }}
        ></div>
        <h3 className={styles.text}>{text}</h3>
      </div>
    </Link>
  );
};

export default ActivityCard;