import Banner from '../../components/Banner/Banner';
import styles from './MainPage.module.css';

const MainPage = () => {
  return (
    <div className={styles.mainPage}>
      <Banner />
      <div className={styles.content}>
        <h1 className={styles.title}>Main Page</h1>
        <p className={styles.subtitle}>
          Banner is live. We can add sections here next.
        </p>
      </div>
    </div>
  );
};

export default MainPage;
