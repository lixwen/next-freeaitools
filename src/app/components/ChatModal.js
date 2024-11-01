import React, { useState } from "react";
import styled from "styled-components";
import { getModelType } from "../data/modelsData";

const Message = styled.div`
  margin-bottom: 1rem;
  text-align: ${({ sender }) => (sender === "user" ? "right" : "left")};
`;

const MessageContent = styled.div`
  display: inline-block;
  max-width: 80%;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  background: ${({ sender }) =>
    sender === "user" 
      ? "linear-gradient(90deg, #4a90e2 0%, #63d8cf 100%)"
      : "#ffffff"};
  color: ${({ sender }) => (sender === "user" ? "#ffffff" : "#333333")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: ${({ sender }) => (sender === "user" ? "none" : "1px solid #e0e0e0")};

  p {
    margin: 0;
    line-height: 1.5;
  }

  strong {
    color: ${({ sender }) => (sender === "user" ? "#ffffff" : "#4a90e2")};
  }
`;

const MessageImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-top: 0.5rem;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-right: 1rem;
  
  h2 {
    margin: 0;
    background: linear-gradient(90deg, #4a90e2 0%, #63d8cf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 1.8rem;
  }
`;

const CloseButton = styled.button`
  padding: 0.5rem 1.2rem;
  background: linear-gradient(90deg, #4a90e2 0%, #63d8cf 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  
  &:hover {
    background: linear-gradient(90deg, #357abd 0%, #50c1b8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ChatBox = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 1rem 0;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f8f9fa;
  max-height: calc(80vh - 200px);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
`;

// 1. 首先定义基础的样式组件
const InputBox = styled.input`
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

// 2. 然后定义依赖于 InputBox 的容器样式
const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;

  .button-group {
    display: flex;
    gap: 0.5rem;
  }

  ${InputBox} {
    flex: 1;
  }
`;

// 3. 定义按钮样式
const SendButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #4a90e2 0%, #63d8cf 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(90deg, #357abd 0%, #50c1b8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ClearButton = styled(SendButton)`
  background: #ff6b6b;
  margin-right: 10px;
  
  &:hover {
    background: #ff5252;
  }
  
  &:disabled {
    background: #ffb3b3;
  }
`;

// 添加 loading 状态的样式组件
const LoadingDots = styled.div`
  display: inline-block;
  text-align: left;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .dots {
    display: inline-flex;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    margin: 0 4px;
    background: #4a90e2;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
  }

  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const ChatModal = ({ isOpen, onClose, modelName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 添加 loading 状态

  const handleClose = () => {
    setMessages([]);
    setInput("");
    onClose();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const prompt = input;
    const modelType = getModelType(modelName);
    setIsLoading(true); // 开始加载

    const userMessage = {
      sender: "user",
      type: "text",
      content: input,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      if (modelType === "Text Generation") {
        const conversationHistory = messages.map(msg => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content
        }));

        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            prompt,
            modelName,
            messages: [...conversationHistory, { role: "user", content: prompt }]
          }),
        });

        const data = await response.json();
        setMessages(prev => [...prev, {
          sender: modelName,
          type: "text",
          content: data.response,
        }]);
      } else {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, modelName }),
        });

        const data = await response.json();
        if (data.type === "image") {
          setMessages(prev => [...prev, {
            sender: modelName,
            type: "image",
            content: data.image,
          }]);
        }
      }
    } catch (error) {
      console.error("Error calling AI model:", error);
      setMessages(prev => [...prev, {
        sender: modelName,
        type: "text",
        content: "Sorry, an error occurred. Please try again.",
      }]);
    } finally {
      setIsLoading(false); // 结束加载
    }
  };

  const renderMessageContent = (message) => {
    switch (message.type) {
      case "image":
        return (
          <MessageContent sender={message.sender}>
            <MessageImage 
              src={message.content} 
              alt="AI Generated" 
            />
          </MessageContent>
        );
      case "text":
      default:
        return (
          <MessageContent sender={message.sender}>
            <p>
              <strong>{message.sender === "user" ? "YOU" : message.sender}:</strong>{" "}
              {message.content}
            </p>
          </MessageContent>
        );
    }
  };

  // 添加加载动画组件
  const LoadingIndicator = () => (
    <Message $sender="assistant">
      <LoadingDots>
        <div className="dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </LoadingDots>
    </Message>
  );

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {  // 允许 Shift+Enter 换行
      e.preventDefault();  // 阻止默认的换行行为
      handleSend();
    }
  };

  // 添加清除历史记录的函数
  const handleClearHistory = () => {
    setMessages([]);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <ModalBackground>
      <ModalContent>
        <ModalHeader>
          <h2>Chat With AI</h2>
          <CloseButton onClick={handleClose}>Close</CloseButton>
        </ModalHeader>
        <ChatBox>
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender}>
              {renderMessageContent(msg)}
            </Message>
          ))}
          {isLoading && <LoadingIndicator />}
        </ChatBox>
        <InputContainer>
          <InputBox
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Input your question..."
            disabled={isLoading}
          />
          <div className="button-group">
            <ClearButton 
              onClick={handleClearHistory}
              disabled={isLoading || messages.length === 0} // 当没有历史记录时禁用
            >
              Clear
            </ClearButton>
            <SendButton 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()} // 当输入为空时禁用
            >
              Send
            </SendButton>
          </div>
        </InputContainer>
      </ModalContent>
    </ModalBackground>
  );
};

export default ChatModal;