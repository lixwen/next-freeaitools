import styles from '../../components/Layout.module.css';

const About = () => {
  return (
    <div className={styles.container}>
      <main>
        <h1 className={styles.title}>About us</h1>
        <p>
          This is an open-source project. You can quickly deploy a similar website by clicking the following link:
        </p>
        <a
          href="https://github.com/lixwen/next-freeaitools.git"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          GitHub Open Source Project
        </a>
        <p>
          If you have any questions or suggestions, please contact me via email: lixu-wen@foxmail.com
        </p>
      </main>
    </div>
  );
};

export default About;
