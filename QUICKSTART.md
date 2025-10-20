# Quick Start Guide - TU Connect

This guide will help you get TU Connect running locally for development and testing.

## Prerequisites

Before you begin, ensure you have:
- Node.js 16+ and npm installed
- An Azure SQL Database instance (or SQL Server for local testing)
- Git

## Quick Setup (5 minutes)

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd tu-connect

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Database

Create an Azure SQL Database or use a local SQL Server instance. Then run the database schema:

```bash
# Connect to your database and run:
# File: database/schema.sql
```

The schema creates two tables:
- `Users` - Stores user accounts
- `Experiences` - Stores stream experience logs

### 3. Configure Environment Variables

Copy the example environment file and update with your settings:

```bash
# Create .env file in the backend directory
cp backend/.env.example backend/.env
```

Edit `backend/.env` and update these values:
```
DB_SERVER=<your-server-name>.database.windows.net
DB_DATABASE=tu-connect
DB_USER=<your-username>
DB_PASSWORD=<your-password>
DB_PORT=1433
JWT_SECRET=<generate-a-long-random-string>
PORT=3001
NODE_ENV=development
```

**Important**: Generate a secure random string for `JWT_SECRET`. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start the Application

Open two terminal windows:

**Terminal 1 - Backend API:**
```bash
# From the root directory
cd backend
npm start
```

The API will start on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
# From the root directory
cd frontend
npm start
```

The React app will open automatically in your browser at `http://localhost:3000`

## First Steps

1. **Register an Account**
   - Click "Register here" on the login page
   - Fill in your details and create an account
   - You'll be automatically logged in

2. **Log Your First Experience**
   - Click "Log New Experience"
   - Fill in the details about your stream visit
   - Click "Log Experience"

3. **View Your Experiences**
   - See all your logged experiences on the main page
   - Click "Edit" to update an experience
   - Click "Delete" to remove an experience

## API Endpoints

Once running, you can test the API at:
- Health Check: `GET http://localhost:3001/api/health`
- Register: `POST http://localhost:3001/api/auth/register`
- Login: `POST http://localhost:3001/api/auth/login`
- Experiences: `GET http://localhost:3001/api/experiences` (requires authentication)

## Troubleshooting

### Backend won't start
- Check that your `backend/.env` file exists and has correct database credentials
- Verify your database server is accessible
- Check firewall rules on Azure SQL Database

### Frontend won't connect to backend
- Ensure backend is running on port 3001
- Check `frontend/.env` has `REACT_APP_API_URL=http://localhost:3001/api`
- Check browser console for CORS errors

### Database connection errors
- Verify your Azure SQL Database firewall allows your IP
- Enable "Allow Azure services and resources to access this server"
- Test connection with Azure Data Studio or SSMS

### Login/Registration not working
- Check browser console for errors
- Verify JWT_SECRET is set in `backend/.env`
- Check backend logs for error messages

## Development Tips

### Hot Reload
Both backend and frontend support hot reload:
- Frontend: Changes to React files will automatically reload the browser
- Backend: Restart the server after making changes (or use nodemon)

### Using nodemon for Backend
Install nodemon for automatic backend restarts:
```bash
npm install -g nodemon
cd backend
nodemon server.js
```

### Viewing Logs
- Backend logs: Check the terminal where `npm start` is running
- Frontend logs: Check browser console (F12 > Console)
- Database logs: Check Azure SQL Database metrics in Azure Portal

### Testing API with curl

**Register a user:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"John","lastName":"Doe"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Create an experience (requires token from login):**
```bash
curl -X POST http://localhost:3001/api/experiences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token-here>" \
  -d '{"streamName":"Rock Creek","location":"Montana","date":"2024-01-15","fishCaught":3,"species":"Rainbow Trout"}'
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for Azure deployment instructions
- Customize the UI styles in `frontend/src/components/*.css`
- Add additional features as needed

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review the logs in both terminals
3. Verify your environment variables
4. Check the GitHub repository for issues or create a new one

Happy fishing! 🎣
