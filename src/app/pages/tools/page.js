'use client'

import React, { useState } from 'react';
import ChatModal from "../../components/ChatModal";
import styles from '../../components/Tools.module.css';
import { models } from '../../data/modelsData';

const Tools = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  console.log("selectedModel on tools: ", selectedModel.name);

  const openModal = (model) => {
    console.log("selectedModel: ", model.name);
    setSelectedModel(model);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className={styles.container}>
      {models.map((category) => (
        <div className={styles.modelContainer} key={category.title}>
          <h2>{category.title}</h2>
          {category.models.map((model) => (
            <div className={styles.modelCard} key={model.id}>
              <span>{model.name}</span>
              <button onClick={() => openModal(model)}>Use Model</button>
            </div>
          ))}
        </div>
      ))}
      <ChatModal isOpen={isModalOpen} onClose={closeModal} modelName={selectedModel.id} />
      <p className={styles.description}>
        Free AI Tools Platform based on Cloudflare AI
      </p>
    </div>
  );
};

export default Tools;
