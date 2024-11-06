"use client";

import React from "react";
import ChatInterface from "./components/ChatInterface";
import SettingsButton from "./components/SettingsButton";
import { Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Box 
      component="main"
      sx={{
        textAlign: 'center',
        py: 2,  // 上下padding
      }}
    >
      <Typography
        variant="h2"  // 或者使用 h3，根据你需要的大小
        component="h2"
        sx={{
          fontWeight: 700,
          color: (theme) => theme.palette.text.primary,
          mb: 2,  // 底部margin
          // 渐变文字效果（可选）
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          // 响应式字体大小
          fontSize: {
            xs: '2rem',     // 手机屏幕
            sm: '2.5rem',   // 平板屏幕
            md: '2.5rem',     // 桌面屏幕
          },
          mt: -3,
        }}
      >
        Let's start using AI assistant
      </Typography>
      <ChatInterface />
      <SettingsButton />
    </Box>
  );
};

export default Home;
