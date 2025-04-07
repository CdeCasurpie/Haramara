import React from 'react';
import styles from './Feature.module.css';

export default function Feature({ name, content }) {
  return (
    <div className={styles.container}>
    {name}
    <div className={styles.content}>
        {content}
    </div>
    </div>
  );
}