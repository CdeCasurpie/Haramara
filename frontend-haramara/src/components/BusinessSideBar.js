import React from 'react';
import { User, Activity, Calendar, Bell } from 'lucide-react';
import styles from './BusinessSideBar.module.css';

const BusinessSideBar = () => {
  const menuItems = [
    { icon: <User size={20} />, text: 'Mis Datos' },
    { icon: <Activity size={20} />, text: 'Mis pedidos' },
    { icon: <Calendar size={20} />, text: 'Mis reservas' },
    { icon: <Bell size={20} />, text: 'Seguidos' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.menuContainer}>
        <h2 className={styles.menuTitle}>Menú Principal</h2>
        
        <nav className={styles.menuNav}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={styles.menuItem}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuText}>{item.text}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.logoutContainer}>
        <button className={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default BusinessSideBar;