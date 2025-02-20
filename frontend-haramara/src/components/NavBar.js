import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HaramaraButton from './HaramaraButton';
import styles from './NavBar.module.css';

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src="/icons/logos/haramara.svg"
                alt="Haramara logo"
                width={95}
                height={95}
                className={styles.logoImage}
              />
              <span className={styles.logoText + " amiri-light"}>HARAMARA</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className={styles.navLinks}>
            <Link href="/actividades" className={styles.link}>
              Actividades
            </Link>
            <Link href="/cursos" className={styles.link}>
              Cursos
            </Link>
            <Link href="/productos" className={styles.link}>
              Productos
            </Link>
            <Link href="/vendedor" className={styles.link + ' ' + styles.seller}>
              ¿ERES UN VENDEDOR?
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className={styles.authButtons}>
            <HaramaraButton variant="primary">INICIAR SESIÓN</HaramaraButton>
            <HaramaraButton variant="primary">REGISTRARSE</HaramaraButton>
          </div>

          {/* Mobile menu button */}
          <button className={styles.mobileMenuButton}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;