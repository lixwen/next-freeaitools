import React, { useState } from "react";
import styled from "styled-components";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;
  margin-bottom: 1rem;
`;

const ChatBox = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f9f9f9;
  max-height: 280px;
`;

const Message = styled.div`
  margin-bottom: 1rem;
  text-align: ${({ sender }) => (sender === "user" ? "right" : "left")};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const InputBox = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SendButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const ChatModal = ({ isOpen, onClose, modelName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const prompt = input;

    // Add user message
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Call AI model API
    try {
      const response = await fetch('/api/text2text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, modelName }),
      });
      console.log("response: ", response);
    
      const aiResponse = await response.json();

      // Add AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: aiResponse },
      ]);
    } catch (error) {
      console.error("Error calling AI model:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackground>
      <ModalContent>
        <CloseButton onClick={onClose}>关闭</CloseButton>
        <h2>与模型对话</h2>
        <ChatBox>
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender}>
              <p>
                <strong>{msg.sender === "user" ? "你" : "AI"}:</strong>{" "}
                {msg.text}
              </p>
            </Message>
          ))}
        </ChatBox>
        <InputContainer>
          <InputBox
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
          />
          <SendButton onClick={handleSend}>发送</SendButton>
        </InputContainer>
      </ModalContent>
    </ModalBackground>
  );
};

export default ChatModal;
