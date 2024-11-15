"use client"

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Home', href: '/' },
    { text: 'Tools', href: '/pages/tools' },
    { text: 'About', href: '/pages/about' },
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'transparent',
        borderBottom: '0.5px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* 左侧Logo */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
            }}
          >
            Free AI Tools
          </Typography>
        </Link>

        {/* 右侧导航 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile ? (
            // 移动端菜单
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem 
                    key={item.text} 
                    onClick={handleClose}
                    component={Link}
                    href={item.href}
                  >
                    {item.text}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            // 桌面端导航
            <>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </>
          )}
          
          {/* GitHub 按钮 */}
          <IconButton
            component="a"
            href="https://github.com/lixwen/next-freeaitools"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'text.primary',
              ml: { xs: 0, sm: 2 },
              '&:hover': {
                color: '#2196F3',
              },
            }}
          >
            <GitHubIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;