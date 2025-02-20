import { useState } from 'react';
import CustomInputLocation from '../CustomInputLocation';
import CustomInputText from '../CustomInputText';
import CustomSelect from '../CustomSelect';
import styles from './SearchBar.module.css';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('productos');

  const handleSearch = () => {
    console.log({ search, location, category });
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.content}>

          <div className={styles.textContainer}>
          <h1 className={styles.title}>Haramara</h1>
          <p className={styles.subtitle}>
            Empieza la diversión y la aventura en el mar.
            <br />
            Reserva, compra y aprende.
          </p>
          </div>
          
          <div className={styles.searchBar}>
            <div className={styles.searchInputs}>
              <CustomInputText
                placeholder="Buscar elementos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <CustomInputLocation
                placeholder="Ubicación..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div className={styles.selectContainer}>
                <CustomSelect
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={[
                    { value: 'productos', label: 'Productos' },
                    { value: 'servicios', label: 'Servicios' },
                    { value: 'cursos', label: 'Cursos' }
                  ]}
                  label={'Buscar en: '}
                />
              </div>
            </div>
            <button className={styles.searchButton} onClick={handleSearch}>
              🔍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SearchBar;