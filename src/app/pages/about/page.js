import styles from '../../components/Layout.module.css';

const About = () => {
  return (
    <div className={styles.container}>
      <main>
        <h1 className={styles.title}>About us</h1>
        <p className={styles.text}>
          This is an open-source project. You can quickly deploy a similar website by clicking the following link:
        </p>
        <a
          href="https://github.com/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          GitHub Open Source Project
        </a>
      </main>
    </div>
  );
};

export default About;
