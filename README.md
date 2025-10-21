# TU Connect

A web application for Trout Unlimited members to log their fishing trips.

## Features

- **User Registration & Authentication**: Self-service user registration with secure JWT-based authentication
- **Standardized Data Entry**: Lookup tables for streams, species, weather, water clarity, and water level ensure consistent data
- **Fishing Trip Logging**: Record detailed information about fishing trips including:
  - Stream (standardized dropdown)
  - Location
  - Start Date/Time
  - Stop Date/Time
  - Weather (standardized dropdown)
  - Water Clarity (standardized dropdown)
  - Water Level (standardized dropdown)
  - Additional Notes
  - Catches
    - Species (standardized dropdown)
    - Length
    - Notes
- **Fishing Trip Management**: View, edit, and delete fishing trips
- **Responsive Design**: Works seamlessly on desktop and mobile browsers

## Technology Stack

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- Modern CSS with responsive design

### Backend
- **Node.js** with Express
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Azure SQL Database** for data persistence
- RESTful API with lookup table endpoints

### Database
- **Azure SQL Database** with T-SQL schema
- Normalized design with lookup tables for data consistency
- Pre-populated with common trout species and standard conditions

## Project Structure

```
tu-connect/
├── .github/
│   └── tu-connect-api.yml        # GitHub Action for deploying API
├── backend/
│   ├── config/
│   │   └── database.js           # Database configuration
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js               # Authentication routes (register, login)
│   │   ├── lookup.js             # Lookup routes (streams, species, weather-conditions, water-clarity-conditions, water-level-conditions, all)
│   │   └── trips.js              # Trip CRUD routes (get, post, put, delete)
│   ├─ server.js                  # Express server entry point
├── database/
│   └── schema.sql                # Database schema for Azure SQL
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Login.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── Register.tsx
│       │   ├── TripList.tsx
│       │   ├── TripForm.tsx
│       │   └── *.css
│       ├── context/
│       │   └── AuthContext.tsx   # Authentication state management
│       ├── services/
│       │   └── api.ts            # API client
│       ├── types/
│       │   └── index.ts          # TypeScript types
│       ├── App.tsx
│       └── index.tsx
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Azure SQL Database instance
- Git

### Backend Setup

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd tu-connect
   ```

2. **Install backend dependencies**
   ```powershell
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Copy `backend/.env.example` to `backend/.env` and update with your Azure SQL Database credentials:
   ```
   DB_SERVER=<your-server-name>.database.windows.net
   DB_DATABASE=tu-connect
   DB_USER=<your-username>
   DB_PASSWORD=<your-password>
   DB_PORT=1433
   JWT_SECRET=<your-secure-secret-key>
   PORT=3001
   NODE_ENV=development
   ```

4. **Set up the database**
   
   Run the SQL script in `database/schema.sql` against your Azure SQL Database to create the required tables:
   ```sql
   -- Connect to your Azure SQL Database and run:
   -- database/schema.sql
   ```

5. **Start the backend server**
   ```powershell
   npm start
   ```
   
   The API will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```powershell
   cd frontend
   ```

2. **Install frontend dependencies**
   ```powershell
   npm install
   ```

3. **Configure environment variables**
   
   The frontend already has a `.env` file configured for local development:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. **Start the React development server**
   ```powershell
   npm start
   ```
   
   The application will open in your browser at `http://localhost:3000`

## Usage

1. **Register**: Create a new account by providing your email, password, first name, and last name
2. **Login**: Sign in with your credentials
3. **Log Fishing Trips**: Click "Log New Trip" to record a stream visit
4. **View Fishing Trips**: See all your logged fishing trips on the main page
5. **Edit/Delete**: Manage your existing fishing trips

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Lookup Data
- `GET /api/lookups/all` - Get all lookup data (streams, species, weather, water conditions)
- `GET /api/lookups/streams` - Get all streams
- `GET /api/lookups/species` - Get all fish species
- `GET /api/lookups/weather-conditions` - Get all weather conditions
- `GET /api/lookups/water-clarity-conditions` - Get all water clarity conditions
- `GET /api/lookups/water-level-conditions` - Get all water level conditions

### Fishing Trips (Protected)
- `GET /api/trips` - Get all fishing trips for logged-in user
- `GET /api/trips/:id` - Get a specific fishing trip
- `POST /api/trips` - Create a new fishing trip
- `PUT /api/trips/:id` - Update an fishing trip
- `DELETE /api/trips/:id` - Delete an fishing trip

### Health Check
- `GET /api/health` - Check API status

## Azure Deployment

### Backend Deployment (Azure App Service)

1. **Create an Azure App Service**
   - Choose Node.js runtime
   - Configure environment variables in App Service settings

2. **Deploy using Git or Azure CLI**
   ```powershell
   az webapp up --name <your-app-name> --resource-group <your-resource-group>
   ```

3. **Configure CORS**
   - Set allowed origins to include your frontend URL

### Frontend Deployment (Azure Static Web Apps or App Service)

1. **Build the React app**
   ```powershell
   cd frontend
   npm run build
   ```

2. **Deploy to Azure Static Web Apps or App Service**
   - Update `REACT_APP_API_URL` environment variable to point to your production API

### Database Setup (Azure SQL Database)

1. **Create Azure SQL Database**
   - Choose appropriate tier (Basic or Standard for development)
   - Configure firewall rules to allow Azure services

2. **Run schema script**
   - Connect using Azure Data Studio or SQL Server Management Studio
   - Execute `database/schema.sql`

## Security Considerations

- Passwords are hashed using bcryptjs before storage
- JWT tokens are used for stateless authentication
- All API endpoints requiring authentication check for valid tokens
- Azure SQL Database connections use encrypted connections
- Environment variables keep sensitive data out of source code

## Development

### Running Tests
```powershell
npm test
```

### Building for Production
```powershell
# Backend - runs as-is with Node.js
cd backend
npm start

# Frontend - create production build
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
