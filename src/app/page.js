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
        py: { xs: 2, sm: 2 }, // 上下padding
        px: { xs: 0, sm: 0 }, // 左右padding
      }}
    >
      <Typography
        variant="h2" // 或者使用 h3，根据你需要的大小
        component="h2"
        sx={{
          fontWeight: { xs: 400, sm: 700 },
          fontSize: { xs: '2rem', sm: '2.5rem' },
          color: 'gray',
          mb: 2, // 底部margin
          WebkitBackgroundClip: "text",
          mt: -2,
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
