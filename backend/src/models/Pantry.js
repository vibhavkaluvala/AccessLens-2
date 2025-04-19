const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  hours: {
    type: String,
    required: true
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  requirements: [String],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index
pantrySchema.index({ location: '2dsphere' });

// Update the updatedAt field before saving
pantrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Pantry', pantrySchema); 