require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const Pantry = require('../models/Pantry');

// Configure axios defaults
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
axios.defaults.headers.common['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
axios.defaults.headers.common['Accept-Language'] = 'en-US,en;q=0.5';

// Rate limiting helper
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Retry helper
async function fetchWithRetry(url, options = {}, retries = 3, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      if (i > 0) {
        console.log(`Retry attempt ${i + 1} for ${url}`);
        await delay(delayMs * i); // Exponential backoff
      }
      const response = await axios(url, options);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying...`);
    }
  }
}

async function getFeedingAmericaLocations(zip, radius = 50) {
  try {
    console.log(`Fetching Feeding America data for zip ${zip}...`);
    
    // First, get the search page to handle any necessary cookies/sessions
    await fetchWithRetry('https://www.feedingamerica.org/find-your-local-foodbank');
    await delay(2000); // Wait before making the search request
    
    // Now make the actual search request
    const response = await fetchWithRetry(
      'https://www.feedingamerica.org/find-your-local-foodbank/search-results', {
        params: {
          zip: zip,
          radius: radius
        },
        headers: {
          'Referer': 'https://www.feedingamerica.org/find-your-local-foodbank'
        }
      }
    );
    
    const $ = cheerio.load(response.data);
    const foodBanks = [];
    
    // Updated selectors based on current Feeding America website structure
    $('.location-item').each((i, elem) => {
      const $elem = $(elem);
      const name = $elem.find('h2').text().trim();
      const address = $elem.find('.address').text().trim();
      const phone = $elem.find('.phone').text().trim();
      const website = $elem.find('a.website').attr('href');
      
      if (name && address) {
        foodBanks.push({
          name,
          address,
          contact: { phone, website },
          source: 'Feeding America',
          hours: 'Please call for current hours'
        });
      }
    });
    
    console.log(`Found ${foodBanks.length} food banks from Feeding America`);
    return foodBanks;
  } catch (error) {
    console.error('Error fetching from Feeding America:', error.message);
    return [];
  }
}

async function getFoodPantriesOrgData(state) {
  try {
    console.log(`Fetching FoodPantries.org data for ${state}...`);
    
    // Get the main state page
    const mainResponse = await fetchWithRetry(
      `https://www.foodpantries.org/st/${state.toLowerCase()}`
    );
    
    const $ = cheerio.load(mainResponse.data);
    const cityLinks = [];
    const pantries = [];
    
    // First collect all city links
    $('.city-links a').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && href.includes(`/${state.toLowerCase()}/`)) {
        cityLinks.push(`https://www.foodpantries.org${href}`);
      }
    });
    
    console.log(`Found ${cityLinks.length} cities in ${state}`);
    
    // Process each city with a delay between requests
    for (const cityUrl of cityLinks.slice(0, 5)) { // Limit to 5 cities for testing
      console.log(`Processing city: ${cityUrl}`);
      await delay(2000); // Wait between city requests
      
      try {
        const cityResponse = await fetchWithRetry(cityUrl);
        const $city = cheerio.load(cityResponse.data);
        
        $('.food-pantry').each((i, elem) => {
          const $elem = $city(elem);
          const name = $elem.find('h2').text().trim();
          const address = $elem.find('.address').text().trim();
          const phone = $elem.find('.phone').text().trim();
          const hours = $elem.find('.hours').text().trim();
          const description = $elem.find('.description').text().trim();
          
          if (name && address) {
            pantries.push({
              name,
              address,
              hours,
              contact: { phone },
              description,
              source: 'FoodPantries.org'
            });
          }
        });
      } catch (cityError) {
        console.error(`Error processing city ${cityUrl}:`, cityError.message);
      }
    }
    
    console.log(`Found ${pantries.length} pantries from FoodPantries.org`);
    return pantries;
  } catch (error) {
    console.error('Error fetching from FoodPantries.org:', error.message);
    return [];
  }
}

async function getUSDAData() {
  try {
    // Use USDA's Food Access Research Atlas API
    const response = await axios.get(
      'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Food_Access_Research_Atlas/FeatureServer/0/query',
      {
        params: {
          where: "State='OH'", // Filter for Ohio
          outFields: 'Urban,Pop2010,County,State,LILATracts_Vehicle,LowIncomeTracts,PovertyRate',
          f: 'json',
          returnGeometry: true
        }
      }
    );

    if (!response.data?.features) {
      console.log('No USDA data features found');
      return [];
    }

    // Transform USDA data into pantry-like entries for food desert areas
    return response.data.features.map(feature => {
      const attrs = feature.attributes;
      const geometry = feature.geometry;
      
      // Only create entries for areas with low income and low food access
      if (attrs.LILATracts_Vehicle !== 1 && attrs.LowIncomeTracts !== 1) {
        return null;
      }

      return {
        name: `Food Resources - ${attrs.County} County`,
        address: `${attrs.County} County, ${attrs.State}`,
        location: {
          type: 'Point',
          coordinates: [geometry.x, geometry.y]
        },
        description: `This area has been identified by the USDA as having limited food access. ` +
                    `Population (2010): ${attrs.Pop2010}. ` +
                    `Poverty Rate: ${attrs.PovertyRate}%.`,
        requirements: [],
        source: 'USDA Food Access Research Atlas',
        tags: ['food desert', attrs.Urban ? 'urban' : 'rural'],
        needsAttention: true // Flag these areas as needing attention
      };
    }).filter(entry => entry !== null); // Remove null entries

  } catch (error) {
    console.error('Error fetching from USDA:', error.message);
    if (error.response) {
      console.error('USDA API Response:', error.response.data);
    }
    return [];
  }
}

function geocodeAddress(address) {
  // We'll implement this later with a geocoding service
  // For now, return null coordinates
  return {
    type: 'Point',
    coordinates: [null, null]
  };
}

async function transformAndGeocodeData(data, source) {
  const transformed = [];
  
  for (const location of data) {
    // Get coordinates for the address
    const geoLocation = await geocodeAddress(location.address);
    
    transformed.push({
      name: location.name,
      address: location.address,
      location: geoLocation,
      hours: location.hours || 'Please call for hours',
      contact: {
        phone: location.contact?.phone,
        website: location.contact?.website
      },
      requirements: location.requirements || [],
      description: location.description || '',
      source: source
    });
  }
  
  return transformed;
}

async function syncPantries() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Keep track of existing pantries
    const existingPantries = new Set();
    
    console.log('Fetching data from national databases...');
    
    // Fetch Ohio data
    console.log('Fetching Feeding America data...');
    const feedingAmericaData = await getFeedingAmericaLocations('43017');
    console.log(`Found ${feedingAmericaData.length} Feeding America locations`);

    console.log('Fetching FoodPantries.org data...');
    const foodPantriesData = await getFoodPantriesOrgData('OH');
    console.log(`Found ${foodPantriesData.length} FoodPantries.org locations`);

    console.log('Fetching USDA Food Access Research Atlas data...');
    const usdaData = await getUSDAData();
    console.log(`Found ${usdaData.length} USDA food access areas`);

    // Transform and geocode all data
    const transformedData = [
      ...(await transformAndGeocodeData(feedingAmericaData, 'Feeding America')),
      ...(await transformAndGeocodeData(foodPantriesData, 'FoodPantries.org')),
      ...(await transformAndGeocodeData(usdaData, 'USDA'))
    ];

    console.log(`Total locations to process: ${transformedData.length}`);
    let updatedCount = 0;

    // Update database
    for (const pantry of transformedData) {
      const key = `${pantry.name}-${pantry.address}`;
      if (!existingPantries.has(key)) {
        existingPantries.add(key);
        await Pantry.findOneAndUpdate(
          { name: pantry.name, address: pantry.address },
          pantry,
          { upsert: true, new: true }
        );
        updatedCount++;
      }
    }

    console.log(`Successfully synced ${updatedCount} locations`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error syncing pantries:', error);
    process.exit(1);
  }
}

// Install required packages
console.log('Installing required packages...');
require('child_process').execSync('npm install cheerio axios');

syncPantries(); 