import styles from './components/Layout.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles.gradient}>Welcome to Use Free AI Tools</span>
        </h1>
        <div className={styles.description}>
          <p className={styles.text}>
            I created this website to allow more people to use AI technology, providing convenient tools and services.
          </p>
          <p className={styles.text}>
            All models are provided by Cloudflare AI and are free to use.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
