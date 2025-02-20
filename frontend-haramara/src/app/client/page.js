'use client';

import NavBar from "@/components/NavBar";
import styles from './page.module.css';
import SearchBar from "@/components/home/SearchBar";
import ActivityCard from "@/components/home/ActivityCard";
import BannerCard from "@/components/home/BannerCard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className={styles.container}>
      <SearchBar />

      <div className={styles.content}>
        
      
      <h2
        className={styles.subtitle}
      >¿Qué quieres hacer hoy?</h2>
      <div className={styles.activityCardContainer}>
        <ActivityCard imageUrl={'/images/home/kids.jpg'} text={'Actividades para niños'} href={"https://google.com"} color={'#005CAD'} />
        <ActivityCard imageUrl={'/images/home/family.jpg'} text={'Actividades en familia'} href={"https://google.com"} color={'#09DCE6'} />
        <ActivityCard imageUrl={'/images/home/profesional.jpg'} text={'Actividades para profesionales'} href={"https://google.com"} color={'#005CAD'} />
        <ActivityCard imageUrl={'/images/home/adultos.jpg'} text={'Actividades para adultos'} href={"https://google.com"} color={'#09DCE6'} />
      </div>

      <br></br>
      <br></br>

      <BannerCard
        imageUrl="/images/home/buceo.jpg"
        mainText="Busca, encuentra y compra."
        subText="Tu actividad, tu curso, tu producto favorito."
        href="/buscar"
        side="left"
      />


      <br></br>
      <br></br>

      <BannerCard
        imageUrl="/images/home/tienda.jpg"
        mainText="Y si eres tienda, potencia tu negocio."
        subText="Entra, regístrate y vende."
        href="/buscar"
        side="right"
      />
      
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      </div>


      <Footer />
    </div>
  );
}