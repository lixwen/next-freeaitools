"use client";

import React from "react";
import ChatInterface from "./components/ChatInterface";
import SettingsButton from "./components/SettingsButton";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import GitHubIcon from "@mui/icons-material/GitHub";

const FeatureCard = ({ icon, title, description }) => (
  <Card
    elevation={2}
    sx={{
      height: "100%",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "translateY(-5px)",
      },
    }}
  >
    <CardContent sx={{ textAlign: "center", p: 3 }}>
      {icon}
      <Typography variant="h6" sx={{ my: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const Home = () => {
  return (
    <Box component="main">
      {/* Hero Section */}
      <Box
        sx={{
          background: "white",
          color: "black",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", sm: "3rem", md: "3.75rem" },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Free to chat with AI assistant
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
              mb: 4,
              opacity: 0.9,
              color: "text.secondary",
            }}
          >
            Try out Cloudflare's AI capabilities or connect with your own API
            key
          </Typography>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<AutoAwesomeIcon sx={{ fontSize: 40, color: "#2196F3" }} />}
              title="Multiple AI Models"
              description="Support multiple types of AI models, including LLaMA, Qwen, Flux, etc."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<SpeedIcon sx={{ fontSize: 40, color: "#2196F3" }} />}
              title="Fast Response"
              description="Get quick and efficient responses from our AI models"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<SecurityIcon sx={{ fontSize: 40, color: "#2196F3" }} />}
              title="Secure & Private"
              description="Your conversations are private and secure"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<GitHubIcon sx={{ fontSize: 40, color: "#2196F3" }} />}
              title="Free & Open Source"
              description="Free to use and open source"
            />
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg">
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "2rem", sm: "2rem", md: "2rem" },
            fontWeight: 700,
            mb: 2,
            textAlign: "center",
          }}
        >
          Let's try it out
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", mb: 1, color: "text.secondary" }}
        >
          Click on the button on the bottom right to use your own
          API key to connect to Cloudflare AI model
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", mb: 2, color: "text.secondary" }}
        >
          You can choose different type of AI models to chat with, including
          text generation, image generation, vision recognition, etc.
        </Typography>
      </Container>

      {/* Chat Interface */}
      <ChatInterface />

      <SettingsButton />
    </Box>
  );
};

export default Home;
