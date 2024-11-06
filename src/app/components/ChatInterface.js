import React, { useState, useRef, useEffect } from "react";
import { models } from "../data/modelsData";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Box,
  Container,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  ListItem,
  ListItemText,
  Divider,
  Card,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import "highlight.js/styles/github.css";

const ChatInterface = () => {
  const [selectedModel, setSelectedModel] = useState(
    "@cf/meta/llama-3.1-8b-instruct"
  );
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      type: "text",
      content: `👋 Welcome to AI Assistant!

Here's a quick guide to get started:
1. Select an AI model
2. Type your question or request in the input box
3. Press the Send button or hit Enter to send your message
4. Use the Clear button to reset the conversation

Let's begin! Feel free to ask any questions.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedModel || isLoading) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          modelName: selectedModel,
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (data.type === "error") {
        throw new Error(data.error);
      }
      if (data.type === "image") {
        const safeBase64 = data.image.replace(/[\r\n]/g, "").trim();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "image",
            content: safeBase64,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: data.response,
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        height: '100vh', 
        marginTop: '-20px',
        py: 2,
        display: 'flex',  // 添加 flex 布局
        flexDirection: 'column'  // 垂直方向排列
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          height: '78%',  // 填充容器高度
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'hidden'  // 防止整体溢出
        }}
      >
        {/* 消息列表区域 */}
        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflowY: 'auto',
              p: 2
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%',
                  mb: 2
                }}
              >
                <Card
                  sx={{
                    maxWidth: '80%',
                    // 区分用户和系统消息的背景色
                    bgcolor: message.role === 'user' 
                      ? 'primary.main' 
                      : (theme) => theme.palette.grey[50], // 浅灰色背景
                    // 文字颜色
                    color: message.role === 'user' 
                      ? 'primary.contrastText' 
                      : 'text.primary',
                    // 添加轻微的阴影效果
                    boxShadow: message.role === 'user'
                      ? 2
                      : 1,
                    // 内边距
                    p: 2,
                    // 圆角
                    borderRadius: 2,
                    // 系统消息的边框
                    border: message.role === 'user' 
                      ? 'none' 
                      : '1px solid',
                    borderColor: 'divider',
                    // 悬停效果
                    '&:hover': {
                      bgcolor: message.role === 'user'
                        ? 'primary.dark'
                        : (theme) => theme.palette.grey[100]
                    }
                  }}
                >
                  {message.role === 'user' ? (
                    <Typography sx={{ textAlign: 'left' }}>{message.content}</Typography>
                  ) : (
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          mb: 1,
                          color: 'text.secondary'
                        }}
                      >
                        {selectedModel.split('/')[2]}:
                      </Typography>
                      {message.type === 'image' ? (
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            minHeight: 200,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          {isLoading && (
                            <CircularProgress 
                              sx={{ 
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                              }} 
                            />
                          )}
                          <Box
                            component="img"
                            src={message.content.startsWith('data:image') 
                              ? message.content 
                              : `data:image/png;base64,${message.content}`}
                            alt="AI Generated Image"
                            sx={{
                              maxWidth: '300px',
                              maxHeight: '300px',
                              objectFit: 'contain',
                              borderRadius: 1,
                              opacity: isLoading ? 0.5 : 1,
                              transition: 'opacity 0.5s'
                            }}
                            onError={(e) => {
                              console.error('Image load error:', e);
                              console.log('Image content:', message.content);  // 添加日志
                              e.target.style.display = 'none';
                            }}
                            onLoad={() => {
                              setIsLoading(false);
                            }}
                          />
                        </Box>
                      ) : (
                        <ReactMarkdown
                          rehypePlugins={[rehypeHighlight, rehypeRaw]}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({children}) => (
                              <Typography 
                                component="p" 
                                sx={{ 
                                  textAlign: 'left',
                                  my: 1 
                                }}
                              >
                                {children}
                              </Typography>
                            ),
                            ul: ({children}) => (
                              <Box 
                                component="ul" 
                                sx={{ 
                                  textAlign: 'left',
                                  pl: 2  // 添加左边距
                                }}
                              >
                                {children}
                              </Box>
                            ),
                            li: ({children}) => (
                              <Typography 
                                component="li" 
                                sx={{ 
                                  textAlign: 'left',
                                  my: 0.5 
                                }}
                              >
                                {children}
                              </Typography>
                            ),
                            code: ({ node, inline, className, children, ...props }) => {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <Paper sx={{ p: 2, my: 2, bgcolor: 'grey.100' }}>
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </Paper>
                              ) : (
                                <code {...props}>{children}</code>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </Box>
                  )}
                </Card>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
        </Box>

        {/* 输入区域 */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            position: 'relative',  // 改为相对定位
            zIndex: 1,
            opacity: isInitialized ? 1 : 0,
            transition: 'opacity 0.2s',
            marginBottom: '-20px'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'flex-start',
              minHeight: '72px',  // 确保容器高度稳定
              position: 'relative'
            }}
          >
            <FormControl 
              sx={{ 
                minWidth: 200,
                height: '56px'  // 固定高度
              }}
            >
              <InputLabel>Choose an AI model</InputLabel>
              <Select
                value={selectedModel || ""}
                onChange={(e) => setSelectedModel(e.target.value)}
                label="Choose an AI model"
              >
                <MenuItem value="">
                  <em>Please select a model</em>
                </MenuItem>
                {models.map((category) => [
                  <ListItem key={category.title} disabled>
                    <ListItemText primary={category.title} />
                  </ListItem>,
                  category.models.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model.split("/")[2]}
                    </MenuItem>
                  )),
                  <Divider key={`divider-${category.title}`} />
                ])}
              </Select>
            </FormControl>

            <Box 
              sx={{ 
                flex: 1,
                display: 'flex',
                minHeight: '56px',  // 固定最小高度
                maxHeight: '120px'  // 最大高度限制
              }}
            >
              <TextField
                multiline
                maxRows={4}
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedModel ? "Input your message..." : "Please select a model first"}
                disabled={!selectedModel || isLoading}
                sx={{ 
                  flex: 1,
                  // 添加以下样式来固定尺寸
                  minHeight: '56px',  // 与单行输入框高度一致
                  '& .MuiInputBase-root': {
                    minHeight: '56px',
                    lineHeight: '1.5',
                  },
                  // 确保多行文本框的初始高度
                  '& .MuiInputBase-inputMultiline': {
                    minHeight: '24px !important',
                    maxHeight: '120px',  // 最大高度限制
                    overflowY: 'auto',
                  },
                  // 防止尺寸突变
                  transition: 'none',
                  '& .MuiInputBase-root': {
                    transition: 'none'
                  },
                  // 固定宽度
                  width: {
                    xs: '100%',
                    sm: '350px',
                    md: '450px',
                    lg: '550px'
                  }
                }}
                // 添加以下属性来优化渲染
                variant="outlined"
                size="medium"
                margin="none"
              />
            </Box>

            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1,
                height: '56px',  // 固定高度
                alignItems: 'center'
              }}
            >
              <IconButton
                color="error"
                onClick={handleClear}
                disabled={messages.length === 0 || isLoading}
              >
                <DeleteIcon />
              </IconButton>
              
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!selectedModel || !input.trim() || isLoading}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
};

export default ChatInterface;
