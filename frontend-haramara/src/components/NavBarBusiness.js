'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HaramaraButton from './HaramaraButton';
import styles from './NavBar.module.css';
import { useUser } from '@/app/UserContext';

const NavBarBusiness = () => {
  const {user, userType, loading, setUser, setLoading, setUserType} = useUser();

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
                width={80}
                height={80}
                className={styles.logoImage}
              />
              <span className={styles.logoText + " amiri-light"}>HARAMARA</span>
              <span className={styles.logoText + " amiri-bold"}>BUSINESS</span>
            </Link>
          </div>


          {
            loading ? (
              <></>
            ) : userType === "company" ? (
              <>
                {/* Auth Buttons */}
                <div className={styles.authButtons}>
                  <HaramaraButton variant="primary">Cerrar Sesión</HaramaraButton>
                </div>

                <div className={styles.profilePhoto}>
                  <Image
                    src="/images/general/profile_default.svg"
                    alt="Profile photo"
                    width={50}
                    height={50}
                    className={styles.profilePhotoImage}
                  />
                </div>

                <div className={styles.profileInfo}>
                  <span className={styles.profileInfoText}>Hola, Nombre</span>
                  <p className={styles.profileInfoSubText}>Administrador</p>
                </div>
                </>
            ) : (
              <div className={styles.authButtons}>
                <Link href="/client/auth/login">
                  <HaramaraButton variant="primary">INICIAR SESIÓN</HaramaraButton>
                </Link>
                <Link href="/client/auth/register-user">
                  <HaramaraButton variant="primary">REGISTRARSE</HaramaraButton>
                </Link>
              </div>
            )
          }

          

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

export default NavBarBusiness;