import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';
import ChatIcon from '@mui/icons-material/Chat';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Welcome to FoodChain
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
        Find food pantries near you and get answers to your questions
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MapIcon sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Find Pantries
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Use our interactive map to locate food pantries in your area. Get directions,
                hours of operation, and contact information.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/map')}
                startIcon={<MapIcon />}
              >
                View Map
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChatIcon sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Ask Questions
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Our AI assistant can help answer your questions about eligibility,
                required documents, and other important information.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/chat')}
                startIcon={<ChatIcon />}
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 