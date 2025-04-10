import React from 'react';
import Gallery from "./Gallery";
import HaramaraButton from "./HaramaraButton";
import styles from "./ActivityCard.module.css";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import StarsRating from "./Stars";
import Price from "./Price";
import Link from "next/link";

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

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                {info.imagesList && Array.isArray(info.imagesList) && info.imagesList.length > 0 ? (
                    <Gallery images={info.imagesList} />
                ) : (
                    <div className={styles.noImage}>
                        <Image
                            src="/images/general/placeholder_image.png"
                            alt="Imagen no disponible"
                            width={150}
                            height={150}
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                )}
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
                            <Link href={`/client/activities/${info.id}`} passHref>
                                <HaramaraButton variant="principal" className={styles.shortButton}>
                                    <p>VER MÁS &#x276F;</p>
                                </HaramaraButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}