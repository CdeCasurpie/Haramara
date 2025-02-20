import styles from './CustomInputLocation.module.css';

const CustomInputLocation = ({ placeholder, value, onChange }) => {
  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <img src="/icons/location.svg" alt="location" className={styles.icon} />
    </div>
  );
};

export default CustomInputLocation;