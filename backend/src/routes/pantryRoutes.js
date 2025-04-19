const express = require('express');
const router = express.Router();
const Pantry = require('../models/Pantry');

// Get all pantries
router.get('/', async (req, res) => {
  try {
    const pantries = await Pantry.find();
    res.json(pantries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pantries by location
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    const pantries = await Pantry.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    });

    res.json(pantries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new pantry
router.post('/', async (req, res) => {
  const pantry = new Pantry({
    name: req.body.name,
    address: req.body.address,
    location: {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude]
    },
    hours: req.body.hours,
    contact: req.body.contact,
    requirements: req.body.requirements,
    description: req.body.description
  });

  try {
    const newPantry = await pantry.save();
    res.status(201).json(newPantry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a pantry
router.patch('/:id', async (req, res) => {
  try {
    const pantry = await Pantry.findById(req.params.id);
    if (!pantry) {
      return res.status(404).json({ message: 'Pantry not found' });
    }

    Object.assign(pantry, req.body);
    const updatedPantry = await pantry.save();
    res.json(updatedPantry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a pantry
router.delete('/:id', async (req, res) => {
  try {
    const pantry = await Pantry.findById(req.params.id);
    if (!pantry) {
      return res.status(404).json({ message: 'Pantry not found' });
    }

    await pantry.remove();
    res.json({ message: 'Pantry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 