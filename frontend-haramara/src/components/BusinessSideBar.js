'use client';

import React, { useState, useEffect } from 'react';
import { User, Activity, Calendar, Bell, LayoutDashboard, LucideLayoutDashboard, ActivityIcon, Calendar1Icon, ShoppingBag, CircleUser, BellPlus, Book } from 'lucide-react';
import styles from './BusinessSideBar.module.css';
import { useRouter, usePathname } from "next/navigation";


const getIdByPath = (path) => {
  let last_path = path.split('/').pop();
  let id = 0;
  switch(last_path){
    case 'dashboard':
      id = 0;
      break;
    case 'actividades':
      id = 1;
      break;
    case 'cursos':
      id = 2;
      break;
    case 'productos':
      id = 3;
      break;
    case 'mis-datos':
      id = 4;
      break;
    case 'anuncios':
      id = 5;
      break;
    default:
      id = 0;
  }

  return id;
}

const BusinessSideBar = ({ initialActive = 0, setActiveState }) => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState(getIdByPath(window.location.pathname));

  // Menu items configuration
  const menuItems = [
    { icon: <LucideLayoutDashboard size={22} />, text: 'Dashboard', id: 0 },
    { icon: <ActivityIcon size={22} />, text: 'Actividades', id: 1 },
    { icon: <Book size={22} />, text: 'Cursos', id: 2 },
   /*  { icon: <ShoppingBag size={22} />, text: 'Productos', id: 3 }, */
    { icon: <CircleUser size={22} />, text: 'Mis Datos', id: 4 },
    { icon: <BellPlus size={22} />, text: 'Anuncios', id: 5 },
  ];

  // Update parent component when active state changes
  useEffect(() => {
    if (setActiveState) {
      setActiveState(activeItem);
    }
  }, [activeItem, setActiveState]);

  // Handle menu item click
  const handleMenuItemClick = (id) => {
    setActiveItem(id);
    let path = `/business/${menuItems[id].text.toLowerCase().replace(' ', '-')}`;
    router.push(path);
  };


 

  return (
    <div className={styles.sidebar}>
      <div className={styles.menuContainer}>
        <h2 className={styles.menuTitle}>Menú Principal</h2>
        
        <nav className={styles.menuNav}>
          {menuItems.map((item) => {
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                className={`${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <span className={styles.menuIcon} style={{ color: isActive ? 'var(--primary-color)' : 'var(--text-color)' }}>
                  {React.cloneElement(item.icon, { 
                    color: isActive ? 'var(--primary-color)' : 'var(--text-color)'
                  })}
                </span>
                <span 
                  className={styles.menuText}
                  style={{ color: isActive ? 'var(--primary-color)' : 'var(--text-color)' }}
                >
                  {item.text}
                </span>
              </button>
            );
          })}
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