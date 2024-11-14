"use client";

import React from "react";
import ChatInterface from "./components/ChatInterface";
import SettingsButton from "./components/SettingsButton";
import { Typography, Box } from "@mui/material";

const Home = () => {
  return (
    <Box
      component="main"
      sx={{
        textAlign: "center",
        py: { xs: 3, sm: 2 }, // 上下padding
        px: { xs: 0, sm: 0 }, // 左右padding
      }}
    >
      <Typography
        variant="h2" // 或者使用 h3，根据你需要的大小
        component="h2"
        sx={{
          // 在移动端完全隐藏
          // display: { xs: "none", sm: "block" },
          fontWeight: 700,
          color: (theme) => theme.palette.text.secondary,
          mb: 2, // 底部margin
          WebkitBackgroundClip: "text",
          // 响应式字体大小
          fontSize: {
            xs: "1rem", // 手机屏幕
            sm: "2rem", // 平板屏幕
            md: "2rem", // 桌面屏幕
          },
          mt: -3,
        }}
      >
        Chat with AI
      </Typography>
      <ChatInterface />
      <SettingsButton />
    </Box>
  );
};

export default Home;
