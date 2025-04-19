import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <LocalDiningIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FoodChain
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/map">
            Find Pantries
          </Button>
          <Button color="inherit" component={RouterLink} to="/chat">
            Chat
          </Button>
          <Button color="inherit" component={RouterLink} to="/about">
            About
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 