'use client'

import React, { useState } from 'react';
import ChatModal from "./components/ChatModal";
import styles from './components/Tools.module.css';
import { models } from './data/modelsData';

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  const openModal = (modelName) => {
    setSelectedModel(modelName);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
           <span className={styles.gradient}>Welcome to Use Free AI Tools</span>
        </h1>
        <p className={styles.subtitle}>
          All models are provided by Cloudflare AI and are free to use.
        </p>
      </div>

      <div className={styles.toolsGrid}>
        {models.map((category) => (
          <div className={styles.modelContainer} key={category.title}>
            <h2>{category.title}</h2>
            {category.models.map((model) => (
              <div className={styles.modelCard} key={model}>
                <div className={styles.modelInfo}>
                  <span>{model}</span>
                  {/* <div className={styles.tooltip}>{model}</div> */}
                </div>
                <button onClick={() => openModal(model)}>Use Model</button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <ChatModal isOpen={isModalOpen} onClose={closeModal} modelName={selectedModel} />
    </div>
  );
};

export default Home;
