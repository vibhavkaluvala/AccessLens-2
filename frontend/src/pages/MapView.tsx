import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert, CircularProgress, Button, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import axios from 'axios';

interface Pantry {
  _id: string;
  name: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  hours: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  requirements?: string[];
  description?: string;
  distance?: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

const MapView: React.FC = () => {
  const [pantries, setPantries] = useState<Pantry[]>([]);
  const [selectedPantry, setSelectedPantry] = useState<Pantry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState<number>(25); // Default 25km radius

  const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
  const apiUrl = process.env.REACT_APP_API_URL;
  const defaultCenter = [-122.4194, 37.7749]; // San Francisco coordinates
  const zoom = searchRadius <= 10 ? 12 : searchRadius <= 25 ? 10 : 9;
  const width = 800;
  const height = 600;

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const fetchPantries = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`${apiUrl}/pantries/nearby`, {
        params: {
          latitude,
          longitude,
          radius: searchRadius // Use the selected radius
        }
      });

      const pantriesWithDistance = response.data.map((pantry: Pantry) => ({
        ...pantry,
        distance: calculateDistance(
          latitude,
          longitude,
          pantry.location.coordinates[1],
          pantry.location.coordinates[0]
        )
      }));

      // Sort pantries by distance
      pantriesWithDistance.sort((a: Pantry, b: Pantry) => (a.distance || 0) - (b.distance || 0));
      setPantries(pantriesWithDistance);
    } catch (err) {
      console.error('Error fetching pantries:', err);
      setError('Failed to fetch nearby food pantries');
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(newLocation);
        fetchPantries(newLocation.latitude, newLocation.longitude);
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to get your location. Please enable location services.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    if (!mapboxToken) {
      setError('Map configuration error: Missing API token');
    }
    getCurrentLocation();
  }, [mapboxToken]);

  // Fetch pantries when radius changes
  useEffect(() => {
    if (userLocation) {
      fetchPantries(userLocation.latitude, userLocation.longitude);
    }
  }, [searchRadius]);

  // Generate markers string for static map
  const markers = [
    // Add user location marker if available
    userLocation && `pin-s+1976D2(${userLocation.longitude},${userLocation.latitude})`,
    // Add pantry markers
    ...pantries.map(pantry => 
      `pin-l+2E7D32(${pantry.location.coordinates[0]},${pantry.location.coordinates[1]})`
    )
  ].filter(Boolean).join(',');

  // Use user location for center if available, otherwise use default
  const center = userLocation 
    ? [userLocation.longitude, userLocation.latitude]
    : defaultCenter;

  // Generate static map URL
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${markers}/${center.join(',')},${zoom}/${width}x${height}?access_token=${mapboxToken}`;

  const formatDistance = (distance?: number): string => {
    if (!distance) return '';
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} meters away`;
    }
    return `${distance.toFixed(1)} km away`;
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
          <br />
          Token status: {mapboxToken ? 'Present' : 'Missing'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)', 
      width: '100%', 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 3
    }}>
      <Box sx={{ 
        width: '100%', 
        maxWidth: width, 
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          {userLocation ? 'Food Pantries Near You' : 'Food Pantry Locations'}
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Search Radius</InputLabel>
          <Select
            value={searchRadius}
            label="Search Radius"
            onChange={(e) => setSearchRadius(Number(e.target.value))}
          >
            <MenuItem value={10}>10 km</MenuItem>
            <MenuItem value={25}>25 km</MenuItem>
            <MenuItem value={50}>50 km</MenuItem>
            <MenuItem value={100}>100 km</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ position: 'relative', width: width, height: height, mb: 3 }}>
        {isLoading ? (
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderRadius: '8px'
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <img 
              src={staticMapUrl} 
              alt="Map of food pantries"
              style={{ 
                width: '100%', 
                height: '100%',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} 
            />
            <Button
              variant="contained"
              startIcon={<MyLocationIcon />}
              onClick={getCurrentLocation}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Update Location
            </Button>
          </>
        )}
        {locationError && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {locationError}
          </Alert>
        )}
      </Box>

      <Box sx={{ width: '100%', maxWidth: width }}>
        <Typography variant="h6" gutterBottom>
          {userLocation ? 'Food Pantries Near You' : 'Food Pantry Locations'}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {pantries.map(pantry => (
            <Paper 
              key={pantry._id} 
              sx={{ 
                p: 2, 
                flex: '1 1 300px',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3
                }
              }}
              onClick={() => setSelectedPantry(pantry)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">{pantry.name}</Typography>
              </Box>
              <Typography variant="body2" paragraph>{pantry.address}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Hours: {pantry.hours}
                </Typography>
                {pantry.distance && (
                  <Chip 
                    label={formatDistance(pantry.distance)}
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              {pantry.requirements && pantry.requirements.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Requirements:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {pantry.requirements.map((req, index) => (
                      <Chip 
                        key={index}
                        label={req}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MapView; 