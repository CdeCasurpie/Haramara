import Link from 'next/link';
import Image from 'next/image';
import styles from './BannerCard.module.css';

const BannerCard = ({ 
  imageUrl, 
  mainText, 
  subText, 
  href, 
  side = 'left' // 'left' o 'right'
}) => {
  return (
    <Link href={href} className={styles.banner}>
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={mainText}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div 
          className={`${styles.gradient} ${styles[side]}`}
        ></div>
        <div className={`${styles.content} ${styles[`content-${side}`]}`}>
          <h2 className={styles.mainText}>{mainText}</h2>
          {subText && <p className={styles.subText}>{subText}</p>}
        </div>
      </div>
    </Link>
  );
};

export default BannerCard;