import { Box, Container, Typography, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

const About = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: '100vh',
      }}
    >
      <Box
        sx={{
          height: { xs: '100%', sm: '78%' },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: 'center',
            fontWeight: { xs: 400, sm: 700 },
            fontSize: { xs: '2rem', sm: '2.5rem' },
            background: 'black',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mt: { xs: -2, sm: -4 },
            mb: 2,
          }}
        >
          About this website
        </Typography>

        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'center',
          maxWidth: 'sm',
          mx: 'auto',
          width: '100%'
        }}>
          <Box
            sx={{
              width: '100%',
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Open Source Project
            </Typography>
            <Typography variant="body1" component="p">
              This is an open-source project. You can quickly deploy a similar website by visiting our GitHub repository. All the models are powered by Cloudflare Workers AI.
            </Typography>
            <Button
              variant="contained"
              startIcon={<GitHubIcon />}
              href="https://github.com/lixwen/next-freeaitools.git"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                mt: 1,
                textTransform: 'none',
                background: 'black',
              }}
            >
              View on GitHub
            </Button>
          </Box>

          <Box
            sx={{
              width: '100%',
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contact
            </Typography>
            <Typography variant="body1" component="p">
              If you have any questions or suggestions, please feel free to contact me.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              href="mailto:lixu-wen@foxmail.com"
              sx={{
                mt: 1,
                textTransform: 'none',
              }}
            >
              lixu-wen@foxmail.com
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default About;
