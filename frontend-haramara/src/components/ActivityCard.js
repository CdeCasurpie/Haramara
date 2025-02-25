import Gallery from "./Gallery";
import HaramaraButton from "./HaramaraButton";
import styles from "./ActivityCard.module.css";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import StarsRating from "./Stars";
import Price from "./Price";
export default function ActivityCard({info}) {
    /*
    id,
    imagesList,
    title,
    location,
    numReservations,
    stars,
    price,
    onSubmit,
    */

    const handleReservationDetails = () => {
        console.log("ver detalles de la reservación");
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
                            <Image
                                src="/images/general/location.svg"
                                alt="Ubicación"
                                width={13}
                                height={13}
                            />
                            <p>{info.location}</p>
                        </div>
                        <div className={styles.detailsItem}>
                            <StarIcon size={13} />
                            <p>{info.numReservations} Reservas realizadas </p>
                        </div>
                    </div>
                    <StarsRating rating={info.stars} size={13} />
                </div>
                <div className={styles.right}>
                    <Price price={info.price} />
                    <div className={styles.buttonContainer}>
                    <HaramaraButton  variant="principal" onClick={handleReservationDetails} className={styles.shortButton}>
                        <p>VER MÁS  &#x276F;</p>
                    </HaramaraButton>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}