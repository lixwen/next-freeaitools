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
  Slider,
  Button,
  Popper,
  Tooltip,
  ClickAwayListener,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import "highlight.js/styles/github.css";

const ChatInterface = () => {
  // 获取第一个可用的模型
  const defaultModel = models[0]?.models[0]?.id || null;

  const [selectedModel, setSelectedModel] = useState(defaultModel);
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

Let's begin! Feel free to ask any questions.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [modelParams, setModelParams] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempParams, setTempParams] = useState({});
  const [hoveredModel, setHoveredModel] = useState(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const selectRef = useRef(null);
  const [selectOpen, setSelectOpen] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // 在组件加载时初始化默认模型的参数
  useEffect(() => {
    if (defaultModel) {
      const modelConfig = models
        .flatMap((category) => category.models)
        .find((model) => model.id === defaultModel);

      if (modelConfig) {
        const defaultParams = {};
        modelConfig.params.forEach((param) => {
          defaultParams[param.name] = param.default;
        });
        setModelParams(defaultParams);
      }
    }
  }, []); // 仅在组件挂载时执行一次

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
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
      const cfAccountId = localStorage.getItem("cf_account_id");
      const cfApiKey = localStorage.getItem("cf_api_key");

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cfAccountId && { "cf-account-id": cfAccountId }),
          ...(cfApiKey && { "cf-api-key": cfApiKey }),
        },
        body: JSON.stringify({
          prompt: input,
          modelName: selectedModel,
          messages: [...messages, userMessage],
          modelParams: modelParams,
        }),
      });

      // 检查Content-Type来判断是否为流式响应
      const contentType = response.headers.get("Content-Type");

      if (contentType?.includes("stream")) {
        // 处理流式文本响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";

        // 添加新的 assistant 消息占位
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: "",
            isLoading: true,
          },
        ]);

        let bufferedLine = ""; // 用来缓冲不完整的 JSON 字符串

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => {
              if (line.startsWith("data: ")) {
                return line.substring(5);
              }
              return line;
            });

          for (const line of lines) {
            bufferedLine += line;

            try {
              const data = JSON.parse(bufferedLine);

              if (data.type === "error") {
                throw new Error(data.error);
              }

              accumulatedContent += data.response || "";

              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === "assistant") {
                  lastMessage.content = accumulatedContent;
                }
                return newMessages;
              });

              // 清空缓冲区，因为本次已经成功解析
              bufferedLine = "";

              // 检查是否包含 "[DONE]"，如果有则退出
              if (line.includes("[DONE]")) {
                break;
              }
            } catch (e) {
              // console.error("Error parsing chunk:", e, line);
            }
          }
        }
      } else {
        // 处理非流式响应（包括图片）
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
              isLoading: false,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              type: "text",
              content: data.response,
              isLoading: false,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: `Error: ${error.message}`,
          isLoading: false,
        },
      ]);
    } finally {
      setIsLoading(false);
      // 确保最后一条消息的 isLoading 状态被重置
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === "assistant") {
          lastMessage.isLoading = false;
        }
        return newMessages;
      });
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

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    const modelConfig = models
      .flatMap((category) => category.models)
      .find((model) => model.id === modelId);

    if (modelConfig) {
      const defaultParams = {};
      modelConfig.params.forEach((param) => {
        defaultParams[param.name] = param.default;
      });
      setModelParams(defaultParams);
    }
  };

  // 处理模型悬停
  const handleModelHover = (event, modelId) => {
    console.log("configuring for model", modelId);
    if (isConfiguring) return; // 如果正在配置参数，不要改变状态

    setHoveredModel(modelId);
    setAnchorEl(event.currentTarget);

    // 初始化临时参数
    const modelConfig = models
      .flatMap((category) => category.models)
      .find((model) => model.id === modelId);

    if (modelConfig) {
      const defaultParams = {};
      modelConfig.params.forEach((param) => {
        defaultParams[param.name] = modelParams[param.name] || param.default;
      });
      setTempParams(defaultParams);
    }
    console.log("handleModelHover", tempParams);
  };

  // 处理参数保存
  const handleSaveParams = () => {
    setModelParams(tempParams);
    setSelectedModel(hoveredModel);
    setAnchorEl(null);
    setIsConfiguring(false);
    setSelectOpen(false);
    // 关闭 Select 下拉框
    selectRef.current?.blur();
  };

  // 处理 Select 的开关
  const handleSelectOpen = () => {
    setSelectOpen(true);
  };

  const handleSelectClose = () => {
    if (!isConfiguring) {
      setSelectOpen(false);
      setAnchorEl(null);
      setHoveredModel(null);
    }
  };

  const handleNumberChange = (e, param) => {
    const value = e.target.value;

    // 允许负数、小数点和值的正则表达式
    if (/^-?\d*\.?\d*$/.test(value)) {
      const numValue = value === "" ? "" : Number(value);

      // 如果是空值或是有效数字
      if (value === "" || !isNaN(numValue)) {
        // 检查是否在允许范围内
        if (
          numValue === "" ||
          (numValue >= param.min && numValue <= param.max)
        ) {
          setTempParams((prev) => ({
            ...prev,
            [param.name]: numValue,
          }));
        }
      }
    }
  };

  // 渲染参数配置弹框
  const renderParamsPopper = () => {
    const modelConfig = models
      .flatMap((category) => category.models)
      .find((model) => model.id === hoveredModel);

    if (!modelConfig?.params) return null;

    return (
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="right-start"
        sx={{
          zIndex: 1300,
          pointerEvents: "auto",
          maxHeight: "80vh",
        }}
      >
        <ClickAwayListener
          onClickAway={() => {
            if (!isConfiguring) {
              // 只在非配置状态时关闭
              setAnchorEl(null);
              setHoveredModel(null);
            }
          }}
        >
          <Paper
            sx={{
              p: 2,
              width: 450,
              mt: -2,
              ml: 2,
              mb: 2,
              boxShadow: 3,
              pointerEvents: "auto",
              maxHeight: "calc(80vh - 20px)",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
                "&:hover": {
                  background: "#666",
                },
              },
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setIsConfiguring(true);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setIsConfiguring(false);
            }}
            onClick={(e) => e.stopPropagation()} // 阻止点击事件冒泡
          >
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Model Parameters Configuration
            </Typography>

            {modelConfig.params.map((param) => (
              <Box
                key={param.name}
                sx={{
                  mb: 2,
                  pointerEvents: "auto", // 确保 Box 可接收事件
                }}
                onClick={(e) => e.stopPropagation()} // 阻止点击事件冒泡
              >
                {param.type === "text" ? (
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    label={param.label}
                    value={tempParams[param.name] || ""}
                    onChange={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      setTempParams((prev) => ({
                        ...prev,
                        [param.name]: e.target.value,
                      }));
                    }}
                    onFocus={(e) => e.stopPropagation()} // 阻止焦点事件冒泡
                    onMouseDown={(e) => e.stopPropagation()} // 阻止鼠标事件冒泡
                    placeholder={param.description}
                    InputProps={{
                      style: {
                        cursor: "text",
                        pointerEvents: "auto", // 确保输入框可以接收事件
                      },
                      readOnly: false,
                      disabled: false,
                    }}
                    sx={{
                      "& .MuiInputBase-root": {
                        cursor: "text",
                        pointerEvents: "auto",
                      },
                      "& .MuiInputBase-input": {
                        cursor: "text",
                        pointerEvents: "auto",
                      },
                    }}
                  />
                ) : param.type === "slider" ? (
                  <>
                    <Typography variant="caption">
                      {param.label}: {tempParams[param.name]}
                    </Typography>
                    <Slider
                      size="small"
                      value={tempParams[param.name]}
                      onChange={(e, value) =>
                        setTempParams((prev) => ({
                          ...prev,
                          [param.name]: value,
                        }))
                      }
                      min={param.min}
                      max={param.max}
                      step={param.step}
                    />
                  </>
                ) : param.type === "number" ? (
                  <TextField
                    size="small"
                    fullWidth
                    type="text" // 改为 text 类型以支持手动输入
                    label={param.label}
                    value={tempParams[param.name]}
                    onChange={(e) => handleNumberChange(e, param)}
                    inputProps={{
                      // 使用 inputProps 而不是 slotProps
                      inputMode: "decimal", // 改为 decimal 以支持负数
                      step: "any", // 允许任意步进
                    }}
                    // 添加辅助文本显示有效范围
                    helperText={`Valid range: ${param.min} to ${param.max}`}
                  />
                ) : null}
                {param.description && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {param.description}
                  </Typography>
                )}
              </Box>
            ))}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
                gap: 1,
              }}
            >
              <Button
                size="small"
                variant="contained"
                startIcon={<RestartAltIcon />}
                onClick={() => {
                  const modelConfig = models
                    .flatMap((category) => category.models)
                    .find((model) => model.id === hoveredModel);

                  if (modelConfig) {
                    const defaultParams = {};
                    modelConfig.params.forEach((param) => {
                      defaultParams[param.name] = param.default;
                    });
                    setTempParams(defaultParams);
                  }
                }}
              >
                Reset
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveParams}
              >
                SAVE
              </Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    );
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        marginTop: "-20px",
        py: 2,
        display: "flex", // 添加 flex 布局
        flexDirection: "column", // 垂直方向排列
      }}
    >
      <Paper
        elevation={3}
        sx={{
          height: "78%", // 填充器高度
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          overflow: "hidden", // 防止整体溢出
        }}
      >
        {/* 消息列表区域 */}
        <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflowY: "auto",
              p: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.role === "user" ? "flex-end" : "flex-start",
                  width: "100%",
                  mb: 2,
                }}
              >
                <Card
                  sx={{
                    maxWidth: "80%",
                    // 区分用户和系统消息的背景色
                    bgcolor:
                      message.role === "user"
                        ? "primary.main"
                        : (theme) => theme.palette.grey[50], // 浅灰色背景
                    // 文字颜色
                    color:
                      message.role === "user"
                        ? "primary.contrastText"
                        : "text.primary",
                    // 添加轻微的阴影效果
                    boxShadow: message.role === "user" ? 2 : 1,
                    p: 2,
                    // 圆角
                    borderRadius: 2,
                    // 系统消息的边框
                    border: message.role === "user" ? "none" : "1px solid",
                    borderColor: "divider",
                    // 悬停效果
                    "&:hover": {
                      bgcolor:
                        message.role === "user"
                          ? "primary.dark"
                          : (theme) => theme.palette.grey[100],
                    },
                  }}
                >
                  {message.role === "user" ? (
                    <Typography sx={{ textAlign: "left" }}>
                      {message.content}
                    </Typography>
                  ) : (
                    <Box sx={{ textAlign: "left" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mb: 1,
                          color: "text.secondary",
                        }}
                      >
                        {selectedModel}:
                      </Typography>
                      {message.type === "image" ? (
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            minHeight: 200,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            component="img"
                            src={
                              message.content.startsWith("data:image")
                                ? message.content
                                : `data:image/png;base64,${message.content}`
                            }
                            alt="AI Generated Image"
                            sx={{
                              maxWidth: "400px",
                              maxHeight: "400px",
                              objectFit: "contain",
                              borderRadius: 1,
                              transition: "opacity 0.5s",
                            }}
                            onError={(e) => {
                              console.error("Image load error:", e);
                              console.log("Image content:", message.content); // 添加日志
                              e.target.style.display = "none";
                            }}
                          />
                        </Box>
                      ) : (
                        <ReactMarkdown
                          rehypePlugins={[rehypeHighlight, rehypeRaw]}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <Typography
                                component="p"
                                sx={{
                                  textAlign: "left",
                                  my: 1,
                                }}
                              >
                                {children}
                              </Typography>
                            ),
                            ul: ({ children }) => (
                              <Box
                                component="ul"
                                sx={{
                                  textAlign: "left",
                                  pl: 2, // 添加左边距
                                }}
                              >
                                {children}
                              </Box>
                            ),
                            li: ({ children }) => (
                              <Typography
                                component="li"
                                sx={{
                                  textAlign: "left",
                                  my: 0.5,
                                }}
                              >
                                {children}
                              </Typography>
                            ),
                            code: ({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) => {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !inline && match ? (
                                <Paper
                                  sx={{ p: 2, my: 2, bgcolor: "grey.100" }}
                                >
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
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
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
            borderColor: "divider",
            bgcolor: "background.paper",
            position: "relative",
            zIndex: 1,
            opacity: isInitialized ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            {/* 模型选择 */}
            <FormControl sx={{ width: 200 }}>
              <InputLabel>Choose A Model</InputLabel>
              <Select
                ref={selectRef}
                value={selectedModel || ""}
                onChange={(e) => handleModelChange(e.target.value)}
                label="Choose A Model"
                open={selectOpen}
                onOpen={handleSelectOpen}
                onClose={handleSelectClose}
              >
                <MenuItem value="">
                  <em>Please Choose A Model</em>
                </MenuItem>
                {models.map((category) => [
                  <ListItem key={category.title} disabled>
                    <ListItemText primary={category.title} />
                  </ListItem>,
                  category.models.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      <span>{model.name}</span>
                    </MenuItem>
                  )),
                  <Divider key={`divider-${category.title}`} />,
                ])}
              </Select>
            </FormControl>

            {/* 模型参数设按钮 */}
            {selectedModel && (
              <Tooltip title="Configure model's parameters" placement="top">
                <IconButton
                  size="large"
                  onClick={(e) => handleModelHover(e, selectedModel)}
                  sx={{
                    padding: "4px",
                    marginLeft: "-8px", // 靠近左侧选择框
                    marginRight: "-10px", // 与输入框保适当距离
                    "& .MuiSvgIcon-root": {
                      color: "text.secondary", // 使用次要文本颜色
                    },
                    "&:hover": {
                      backgroundColor: "action.hover",
                      "& .MuiSvgIcon-root": {
                        color: "primary.main", // 悬停时变为主题色
                      },
                    },
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            )}
            {renderParamsPopper()}

            {/* 消息输入框 */}
            <TextField
              multiline
              maxRows={4}
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedModel
                  ? "Input Your Message..."
                  : "Please Choose A Model"
              }
              disabled={!selectedModel || isLoading}
              sx={{
                flex: 1,
                "& .MuiInputBase-root": {
                  height: "56px",
                },
              }}
            />

            {/* 操作按钮 */}
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
        </Paper>
      </Paper>
    </Container>
  );
};

export default ChatInterface;
