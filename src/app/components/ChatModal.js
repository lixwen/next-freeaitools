import React, { useState } from "react";
import styled from "styled-components";

const Message = styled.div`
  margin-bottom: 1rem;
  text-align: ${({ sender }) => (sender === "user" ? "right" : "left")};
`;

const MessageContent = styled.div`
  display: inline-block;
  max-width: 80%;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: ${({ sender }) =>
    sender === "user" ? "#e3f2fd" : "#f5f5f5"};
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  background: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const ChatBox = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  max-height: calc(80vh - 200px);
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const InputBox = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const SendButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ChatModal = ({ isOpen, onClose, modelName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const prompt = input;

    // 添加用户消息
    setMessages([
      ...messages,
      {
        sender: "user",
        type: "text",
        content: input,
      },
    ]);
    setInput("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, modelName }),
      });


      const data = await response.json();

      // 根据响应类型添加不同的消息
      if (data.type === "image") {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: modelName,
            type: "image",
            content: data.image,
          },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: modelName,
            type: "text",
            content: data.response,
          },
        ]);
      }
    } catch (error) {
      console.error("Error calling AI model:", error);
      // 添加错误消息
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: modelName,
          type: "text",
          content: "Sorry, an error occurred. Please try again.",
        },
      ]);
    }
  };

  // 渲染消息内容
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

  if (!isOpen) return null;

  return (
    <ModalBackground>
      <ModalContent>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <h2>Chat With AI</h2>
        <ChatBox>
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender}>
              {renderMessageContent(msg)}
            </Message>
          ))}
        </ChatBox>
        <InputContainer>
          <InputBox
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Input your question..."
          />
          <SendButton onClick={handleSend}>Send</SendButton>
        </InputContainer>
      </ModalContent>
    </ModalBackground>
  );
};

export default ChatModal;
