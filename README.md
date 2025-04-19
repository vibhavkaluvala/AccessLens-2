# AccessLens 🌟

A comprehensive solution designed to help people find and access food resources in their area, with a focus on making food pantries and assistance programs more accessible to those in need.

## 🎯 Mission
To bridge the gap between people experiencing food insecurity and the resources available to help them by providing an easy-to-use platform that shows nearby food pantries, their requirements, and operating hours.

## 🌟 Features

### 1. Interactive Food Pantry Map
- **Real-time Location**: Find food pantries near your current location
- **Distance Calculation**: See how far each pantry is from you
- **Detailed Information**: View hours, requirements, and contact details
- **Accessibility Focus**: Easy-to-use interface for all users

### 2. Food Resource Database
- **Comprehensive Listings**: Detailed information about local food pantries
- **Regular Updates**: Fresh data from multiple sources
- **Verified Information**: Accurate and up-to-date pantry details
- **Requirements Display**: Clear listing of what's needed to receive assistance

### 3. Search and Filter
- **Location-based Search**: Find resources by zip code or city
- **Distance Filtering**: Set your preferred search radius
- **Operating Hours**: Filter by currently open pantries
- **Requirements Filter**: Find pantries matching your situation

## 🛠️ Technical Stack

### Backend
- **Framework**: Node.js with Express
- **Database**: MongoDB for pantry data storage
- **Geospatial**: MongoDB geospatial queries for location-based search
- **Data Sync**: Automated scripts for updating pantry information

### Frontend
- **Framework**: React with TypeScript
- **Mapping**: Leaflet for interactive maps
- **UI Components**: Modern, responsive design
- **Geolocation**: Browser-based location services

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/AccessLens-2.git
cd AccessLens-2
```

2. Backend Setup
```bash
cd backend
npm install
```

3. Frontend Setup
```bash
cd frontend
npm install
```

4. Environment Configuration
Create a `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_uri
PORT=3000
```

### Running the Application

1. Start the Backend
```bash
cd backend
npm start
```

2. Start the Frontend
```bash
cd frontend
npm start
```

2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   MAPBOX_ACCESS_TOKEN=your_mapbox_token
   OPENAI_API_KEY=your_openai_key
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development servers:
   ```bash
   npm start
   ```

## Project Structure

```
foodchain/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
└── package.json       # Root package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
