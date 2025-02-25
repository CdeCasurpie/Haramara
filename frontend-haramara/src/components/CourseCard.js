import styles from './CourseCard.module.css';
import Gallery from './Gallery';
import Image from 'next/image';
import Price from './Price';
import HaramaraButton from './HaramaraButton';


export default function CourseCard({ info }) {
    /*
    id,
    imageList,
    title,
    startDate,
    endDate,
    minAge,
    level?,
    location,
    price,
    */

    const handleInscription = () => {
        console.log("Inscribirse en el curso");
    }

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <Gallery images={info.imagesList} />
            </div>

            <div className={styles.infoContainer}>
            <div className={styles.title}>
                <h1>{info.title}</h1>
            </div>
            <div className={styles.detailsContainer}>
                <div className={styles.left}>
                    <div className={styles.details}>
                        <div className={styles.detailsItem}>
                            {info.startDate} - {info.endDate}
                        </div>
                        <div className={styles.detailsItem}>
                            Desde los {info.minAge} años
                        </div>
                        {
                            info.level && (
                                <div className={styles.detailsItem}>
                                    {info.level}
                                </div>
                            )
                        }
                    </div>

                    <div className={styles.location}>
                        <Image
                            src="/images/general/location.svg"
                            alt="Ubicación"
                            width={13}
                            height={13}
                        />
                        <div className={styles.locationText}>
                            {info.location}
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <Price price={info.price} />
                    <div className={styles.buttonContainer}>
                    <HaramaraButton  variant="principal" onClick={handleInscription} className={styles.shortButton}>
                        <p>VER MÁS  &#x276F;</p>
                    </HaramaraButton>
                    </div>
                </div>
            </div>
        </div>

        </div>
    );
}
