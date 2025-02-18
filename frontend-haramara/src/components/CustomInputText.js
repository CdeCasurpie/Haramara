import styles from './CustomInputText.module.css';

const CustomInputText = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      className={styles.input}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default CustomInputText;