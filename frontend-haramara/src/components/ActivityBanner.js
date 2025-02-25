import styles from './ActivityBanner.module.css';
import Image from 'next/image';
import Price from './Price';
import { Stars } from 'lucide-react';
import StarsRating from './Stars';
import Gallery from './Gallery';
export default function ActivityBanner({info}) {
    return (
        <div className={styles.banner}>
            <div className={styles.imageContainer}>
                <Gallery images={info.imagesList} autoPlay={true}/>
            </div>
            <div className={styles.gradient}>

            </div>
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.location}>
                    <Image
                        src="/images/general/locationGood.svg"
                        alt="Ubicación"
                        width={20}
                        height={20}
                        className={styles.whiteIcon}
                    />
                    {info.location}
                    </div>
                    <div className={styles.details}>
                        <div className={styles.title}>{info.title}</div>
                        Edad mínima: {info.minAge}
                    </div>
                </div>
                <div className={styles.right}>
                    <Price price={info.price} className={styles.priceColor}/>
                    <div className={styles.stars}>
                        <StarsRating rating={info.stars}  size={13} starSpacing={5}/>
                    </div>
                </div>
            </div>
        </div>
    );
}