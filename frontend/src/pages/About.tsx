import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MapIcon from '@mui/icons-material/Map';
import ChatIcon from '@mui/icons-material/Chat';

const About: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        About FoodChain
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="body1" paragraph>
          FoodChain is a platform designed to help individuals and families find food pantries
          in their local area. Our mission is to make it easier for people to access free
          food resources when they need them most.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MapIcon sx={{ mr: 1 }} />
              <Typography variant="h5">Find Pantries</Typography>
            </Box>
            <Typography variant="body1">
              Our interactive map helps you locate food pantries near you. Get directions,
              hours of operation, and contact information all in one place.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ChatIcon sx={{ mr: 1 }} />
              <Typography variant="h5">AI Assistant</Typography>
            </Box>
            <Typography variant="body1">
              Our AI-powered assistant can answer your questions about eligibility,
              required documents, and other important information about food pantries.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalDiningIcon sx={{ mr: 1 }} />
              <Typography variant="h5">Community Focus</Typography>
            </Box>
            <Typography variant="body1">
              We're committed to helping communities by making food resources more
              accessible and reducing food insecurity.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          How to Use FoodChain
        </Typography>
        <Typography variant="body1" paragraph>
          1. Visit the map page to find food pantries in your area
        </Typography>
        <Typography variant="body1" paragraph>
          2. Use the chat feature to ask questions about eligibility and requirements
        </Typography>
        <Typography variant="body1" paragraph>
          3. Get directions and contact information for the pantry you choose
        </Typography>
      </Paper>
    </Box>
  );
};

export default About; 