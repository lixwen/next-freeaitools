const ModelCard = ({ model }) => {
  return (
    <div className="model-card">
      <h3>{model}</h3>
      <button>使用模型</button>
    </div>
  );
};

export default ModelCard;
