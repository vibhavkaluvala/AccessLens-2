require('dotenv').config();
const mongoose = require('mongoose');
const Pantry = require('../models/Pantry');

const pantries = [
  // San Francisco
  {
    name: "SF-Marin Food Bank",
    address: "900 Pennsylvania Ave, San Francisco, CA 94107",
    location: {
      type: "Point",
      coordinates: [-122.3934, 37.7544]
    },
    hours: "Mon-Fri: 8am-5pm, Sat: 9am-4pm",
    contact: {
      phone: "(415) 282-1900",
      website: "https://www.sfmfoodbank.org"
    },
    requirements: ["Photo ID", "Proof of address", "Income verification"],
    description: "The SF-Marin Food Bank partners with 350 organizations to provide food to over 140,000 people each week."
  },
  // East Bay
  {
    name: "Alameda County Community Food Bank",
    address: "7900 Edgewater Dr, Oakland, CA 94621",
    location: {
      type: "Point",
      coordinates: [-122.2097, 37.7503]
    },
    hours: "Mon-Fri: 8:30am-5pm",
    contact: {
      phone: "(510) 635-3663",
      website: "https://www.accfb.org"
    },
    requirements: ["Photo ID"],
    description: "Serving Alameda County residents with fresh food and groceries."
  },
  {
    name: "Berkeley Food Pantry",
    address: "1600 Sacramento St, Berkeley, CA 94702",
    location: {
      type: "Point",
      coordinates: [-122.2867, 37.8766]
    },
    hours: "Mon, Wed, Fri: 2pm-4pm",
    contact: {
      phone: "(510) 525-2280"
    },
    requirements: ["Proof of Berkeley residency"],
    description: "Providing emergency food to Berkeley residents."
  },
  // South Bay
  {
    name: "Second Harvest of Silicon Valley",
    address: "4001 North First Street, San Jose, CA 95134",
    location: {
      type: "Point",
      coordinates: [-121.9539, 37.4175]
    },
    hours: "Mon-Fri: 8am-5pm",
    contact: {
      phone: "(408) 266-8866",
      website: "https://www.shfb.org"
    },
    requirements: [],
    description: "Serving Santa Clara and San Mateo Counties."
  },
  {
    name: "Sunnyvale Community Services",
    address: "725 Kifer Rd, Sunnyvale, CA 94086",
    location: {
      type: "Point",
      coordinates: [-122.0074, 37.3735]
    },
    hours: "Mon-Fri: 9am-4pm",
    contact: {
      phone: "(408) 738-4321",
      website: "https://svcommunityservices.org"
    },
    requirements: ["Photo ID", "Proof of Sunnyvale residency"],
    description: "Emergency food assistance for Sunnyvale residents."
  },
  // Peninsula
  {
    name: "Second Harvest Food Bank - San Mateo",
    address: "1051 Bing St, San Carlos, CA 94070",
    location: {
      type: "Point",
      coordinates: [-122.2627, 37.5079]
    },
    hours: "Mon-Fri: 8am-5pm",
    contact: {
      phone: "(650) 610-0800"
    },
    requirements: ["San Mateo County residency"],
    description: "Serving San Mateo County residents."
  },
  // North Bay
  {
    name: "SF-Marin Food Bank - San Rafael",
    address: "2550 Kerner Blvd, San Rafael, CA 94901",
    location: {
      type: "Point",
      coordinates: [-122.5066, 37.9621]
    },
    hours: "Mon-Fri: 8am-5pm",
    contact: {
      phone: "(415) 883-1302"
    },
    requirements: ["Marin County residency"],
    description: "Serving Marin County residents with food assistance."
  },
  // Ohio - Columbus Area
  {
    name: "Mid-Ohio Food Collective",
    address: "3960 Brookham Dr, Grove City, OH 43123",
    location: {
      type: "Point",
      coordinates: [-83.0929, 39.8814]
    },
    hours: "Mon-Fri: 8am-4pm",
    contact: {
      phone: "(614) 277-3663",
      website: "https://www.midohiofoodbank.org"
    },
    requirements: ["Photo ID", "Proof of address"],
    description: "Central Ohio's largest food bank serving 20 counties in the region."
  },
  {
    name: "Dublin Food Pantry",
    address: "81 W Bridge St, Dublin, OH 43017",
    location: {
      type: "Point",
      coordinates: [-83.1141, 40.0992]
    },
    hours: "Mon: 5:30pm-7:30pm, Wed: 9am-11am, Thu: 5:30pm-7:30pm",
    contact: {
      phone: "(614) 889-6590",
      website: "https://www.dublinfoodpantry.org"
    },
    requirements: ["Photo ID", "Proof of Dublin residence"],
    description: "Serving Dublin and northwest Columbus residents."
  },
  {
    name: "WARM Food Pantry",
    address: "150 Leasure Dr, Westerville, OH 43081",
    location: {
      type: "Point",
      coordinates: [-82.9183, 40.1259]
    },
    hours: "Mon-Fri: 9am-4pm",
    contact: {
      phone: "(614) 899-0196",
      website: "https://www.warmwesterville.org"
    },
    requirements: ["Photo ID", "Proof of residence"],
    description: "Westerville Area Resource Ministry serving the Westerville area."
  },
  {
    name: "Lutheran Social Services Food Pantry",
    address: "1460 S Champion Ave, Columbus, OH 43206",
    location: {
      type: "Point",
      coordinates: [-82.9657, 39.9469]
    },
    hours: "Mon-Fri: 9am-1pm",
    contact: {
      phone: "(614) 444-4246",
      website: "https://www.lssnetworkofhope.org/food-pantries"
    },
    requirements: ["Photo ID"],
    description: "Part of the LSS Network of Hope serving Central Ohio."
  },
  {
    name: "Worthington Resource Pantry",
    address: "6700 Huntley Rd, Columbus, OH 43229",
    location: {
      type: "Point",
      coordinates: [-83.0019, 40.1084]
    },
    hours: "Tue: 10am-2pm, Wed: 1pm-7pm, Thu: 10am-2pm",
    contact: {
      phone: "(614) 985-1766",
      website: "https://www.worthingtonresourcepantry.org"
    },
    requirements: ["Photo ID", "Proof of residence"],
    description: "Serving Worthington and north Columbus communities."
  },
  {
    name: "Powell Community Food Pantry",
    address: "44 N Liberty St, Powell, OH 43065",
    location: {
      type: "Point",
      coordinates: [-83.0752, 40.1581]
    },
    hours: "Wed: 2pm-6pm, Sat: 10am-1pm",
    contact: {
      phone: "(740) 965-9700"
    },
    requirements: ["Photo ID", "Proof of Powell/Liberty Township residence"],
    description: "Serving Powell and Liberty Township residents."
  },
  {
    name: "Hilliard Food Pantry",
    address: "3800 Main St, Hilliard, OH 43026",
    location: {
      type: "Point",
      coordinates: [-83.1359, 40.0334]
    },
    hours: "Tue: 2pm-7pm, Thu: 10am-3pm",
    contact: {
      phone: "(614) 363-4159"
    },
    requirements: ["Photo ID", "Proof of Hilliard residence"],
    description: "Serving the Hilliard community with emergency food assistance."
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing pantries
    await Pantry.deleteMany({});
    console.log('Cleared existing pantries');

    // Insert new pantries
    await Pantry.insertMany(pantries);
    console.log('Successfully seeded pantries');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 