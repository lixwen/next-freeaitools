import styles from './components/Layout.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <main>
        <h1 className={styles.title}> Welcome to Free AI Tools</h1>
        <p className={styles.text}>
          We created this website to allow more people to use AI technology, providing convenient tools and services.
        </p>
      </main>
    </div>
  );
};

export default Home;
