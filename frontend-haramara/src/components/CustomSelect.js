import styles from './CustomSelect.module.css';

const CustomSelect = ({ value, onChange, options, label }) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.selectContainer}>
      <select 
        className={styles.select}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <img src='/icons/downArrow.svg' alt='arrow down' className={styles.icon} />
      </div>
    </div>
  );
};

export default CustomSelect;