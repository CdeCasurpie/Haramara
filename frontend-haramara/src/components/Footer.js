import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Sección principal */}
        <div className={styles.mainSection}>
          <div className={styles.brandSection}>
            <Link href="/" className={styles.logoContainer}>
              <Image
                src="/icons/logos/haramara-white.svg"
                alt="Haramara Logo"
                width={70}
                height={70}
                className={styles.logo}
              />
              <span className={styles.brandName}>HARAMARA</span>
            </Link>
            <p className={styles.description}>
                Haramara. Reserva, solo o en compañía, para vivir experiencias increíbles, aprende de los profesionales con sus cursos de formación  y equípate para tu próxima aventura. 
            </p>
          </div>


          <div className={styles.bar}></div>

          {/* Enlaces rápidos */}
          <div className={styles.linksSection}>
            <h3>Enlaces rápidos</h3>
            <nav>
              <Link href="/actividades">Actividades</Link>
              <Link href="/cursos">Cursos</Link>
              <Link href="/productos">Productos</Link>
              <Link href="/sobre-nosotros">Sobre nosotros</Link>
              <Link href="/blog">Blog</Link>
            </nav>
          </div>

          <br></br>

          {/* Contacto */}
          <div className={styles.contactSection}>
            <h3>Contacto con Haramara</h3>
            <div className={styles.contactInfo}>
              <a href="tel:+34999999999" className={styles.contactItem}>
                +34 999 999 999
              </a>
              <a href="mailto:haramara.proyecto@gmail.com" className={styles.contactItem}>
                haramara.proyecto@gmail.com
              </a>
              <div className={styles.contactItem}>
                Calle Direccion 234, España.
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          © Haramara. Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer;