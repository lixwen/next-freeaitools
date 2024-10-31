'use client'

import React, { useState } from 'react';
import ChatModal from "../../components/ChatModal";
import styles from '../../components/Tools.module.css';
import { models } from '../../data/modelsData';

const Tools = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  console.log("selectedModel on tools: ", selectedModel);

  const openModal = (model) => {
    console.log("selectedModel: ", model);
    setSelectedModel(model);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className={styles.container}>
      <main>
        <h1>AI Tools</h1>
        <p style={{ textAlign: "center", fontSize: "1rem", color: "#666" }}>
          Free AI Tools Platform based on Cloudflare AI
        </p>
        {models.map((category) => (
          <div className={styles.modelContainer} key={category.title}>
            <h2>{category.title}</h2>
            {category.models.map((model) => (
              <div className={styles.modelCard} key={model}>
                <span>{model}</span>
                <button onClick={() => openModal(model)}>Use Model</button>
              </div>
            ))}
          </div>
        ))}
      </main>
      <ChatModal isOpen={isModalOpen} onClose={closeModal} modelName={selectedModel} />
    </div>
  );
};

export default Tools;
