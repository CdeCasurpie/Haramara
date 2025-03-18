import styles from './CourseCard.module.css';
import Gallery from './Gallery';
import Image from 'next/image';
import Price from './Price';
import HaramaraButton from './HaramaraButton';


export default function CourseCard({ info, setCurrentCourse }) {
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
    business,
    total_revenue,
    num_reservations,
    */

    const handleInscription = () => {
        console.log("Inscribirse en el curso");
    }

    return (
        <div
            className={styles.container}
            style={{ transform: info.business ? "scale(0.9)" : "scale(1)" }}
            >

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
                        {
                            info.business && (
                                <div className={styles.detailsItem}>
                                    Precio: 
                                    {info.price} €
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
                {
                    info.business ? (
                        <div className={styles.rightBusiness}>
                            <div className={styles.editContaner}
                                onClick={() => setCurrentCourse(info)}
                            >
                                <Image
                                    src="/images/general/edit.svg"
                                    alt="Editar"
                                    width={20}
                                    height={20}
                                />
                            </div>
                            <div className={styles.revenueContainer}>
                                < div className = {styles.reservationInfo} >
                                    <div className = {styles.reservationReveneu}>
                                        <div className={styles.reveneu}>
                                        {info.total_revenue} €
                                        </div>
                                        recaudados                     
                                    </div>
                                    <div className={styles.reservationInfo}>
                                        {info.num_reservations} reservas realizadas
                                    </div>
                                </div>
                                <HaramaraButton  variant="primary" onClick={handleInscription} className={styles.shortButton}>
                                    <p> VER DETALLE  &#x276F;</p>
                                </HaramaraButton>
                            </div>
                        </div>
                    ) :
                    (
                        <div className={styles.right}>
                            <div className={styles.priceContainer}>
                            <Price price={info.price} />
                            </div>
                            <div className={styles.buttonContainer}>
                            <HaramaraButton  variant="principal" onClick={handleInscription} className={styles.shortButton}>
                                <p>VER MÁS  &#x276F;</p>
                            </HaramaraButton>
                            </div>
                        </div>
                    )
                }

            </div>
        </div>

        </div>
    );
}
