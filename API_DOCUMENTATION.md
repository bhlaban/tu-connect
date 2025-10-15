# TU Connect API Documentation

## Base URL

```
Local Development: http://localhost:3001/api
Production: https://your-app-name.azurewebsites.net/api
```

## Authentication

Most endpoints require authentication via JWT (JSON Web Token). Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens are obtained from the `/auth/login` or `/auth/register` endpoints and are valid for 24 hours.

---

## Endpoints

### Health Check

Check if the API is running.

**Endpoint:** `GET /health`

**Authentication:** Not required

**Response:**
```json
{
  "status": "ok",
  "message": "TU Connect API is running"
}
```

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation:**
- `email`: Required, must be valid email format, must be unique
- `password`: Required, minimum 6 characters
- `firstName`: Required
- `lastName`: Required

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses:**

400 Bad Request - Missing fields:
```json
{
  "error": "All fields are required"
}
```

400 Bad Request - Password too short:
```json
{
  "error": "Password must be at least 6 characters"
}
```

400 Bad Request - Email already exists:
```json
{
  "error": "Email already registered"
}
```

500 Internal Server Error:
```json
{
  "error": "Registration failed"
}
```

---

### Login User

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses:**

400 Bad Request - Missing fields:
```json
{
  "error": "Email and password are required"
}
```

401 Unauthorized - Invalid credentials:
```json
{
  "error": "Invalid email or password"
}
```

500 Internal Server Error:
```json
{
  "error": "Login failed"
}
```

---

## Experience Endpoints

All experience endpoints require authentication. Include the JWT token in the Authorization header.

### Create Experience

Log a new stream experience.

**Endpoint:** `POST /experiences`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "streamName": "Rock Creek",
  "location": "Montana",
  "date": "2024-01-15",
  "weather": "Sunny",
  "waterCondition": "Clear",
  "fishCaught": 5,
  "species": "Rainbow Trout, Brown Trout",
  "notes": "Great day on the water. Fish were active in the morning."
}
```

**Required Fields:**
- `streamName`: String
- `location`: String
- `date`: Date (YYYY-MM-DD format)

**Optional Fields:**
- `weather`: String
- `waterCondition`: String
- `fishCaught`: Integer (default: 0)
- `species`: String
- `notes`: String (text)

**Success Response (201 Created):**
```json
{
  "message": "Experience logged successfully",
  "experience": {
    "id": 1,
    "userId": 1,
    "streamName": "Rock Creek",
    "location": "Montana",
    "date": "2024-01-15T00:00:00.000Z",
    "weather": "Sunny",
    "waterCondition": "Clear",
    "fishCaught": 5,
    "species": "Rainbow Trout, Brown Trout",
    "notes": "Great day on the water. Fish were active in the morning.",
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": null
  }
}
```

**Error Responses:**

400 Bad Request - Missing required fields:
```json
{
  "error": "Stream name, location, and date are required"
}
```

401 Unauthorized - Missing or invalid token:
```json
{
  "error": "Access token required"
}
```

403 Forbidden - Invalid token:
```json
{
  "error": "Invalid or expired token"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to log experience"
}
```

---

### Get All Experiences

Retrieve all experiences for the logged-in user.

**Endpoint:** `GET /experiences`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200 OK):**
```json
{
  "experiences": [
    {
      "id": 2,
      "userId": 1,
      "streamName": "Silver Creek",
      "location": "Idaho",
      "date": "2024-01-20T00:00:00.000Z",
      "weather": "Cloudy",
      "waterCondition": "Normal Flow",
      "fishCaught": 3,
      "species": "Rainbow Trout",
      "notes": "Water was perfect. Had to work for the fish.",
      "createdAt": "2024-01-20T16:00:00.000Z",
      "updatedAt": null
    },
    {
      "id": 1,
      "userId": 1,
      "streamName": "Rock Creek",
      "location": "Montana",
      "date": "2024-01-15T00:00:00.000Z",
      "weather": "Sunny",
      "waterCondition": "Clear",
      "fishCaught": 5,
      "species": "Rainbow Trout, Brown Trout",
      "notes": "Great day on the water. Fish were active in the morning.",
      "createdAt": "2024-01-15T14:30:00.000Z",
      "updatedAt": null
    }
  ]
}
```

**Note:** Experiences are returned in descending order by date (most recent first).

---

### Get Single Experience

Retrieve a specific experience by ID.

**Endpoint:** `GET /experiences/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Experience ID (integer)

**Success Response (200 OK):**
```json
{
  "experience": {
    "id": 1,
    "userId": 1,
    "streamName": "Rock Creek",
    "location": "Montana",
    "date": "2024-01-15T00:00:00.000Z",
    "weather": "Sunny",
    "waterCondition": "Clear",
    "fishCaught": 5,
    "species": "Rainbow Trout, Brown Trout",
    "notes": "Great day on the water. Fish were active in the morning.",
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": null
  }
}
```

**Error Responses:**

404 Not Found:
```json
{
  "error": "Experience not found"
}
```

---

### Update Experience

Update an existing experience.

**Endpoint:** `PUT /experiences/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Experience ID (integer)

**Request Body:**
All fields are required (current values if not changing):
```json
{
  "streamName": "Rock Creek",
  "location": "Montana, USA",
  "date": "2024-01-15",
  "weather": "Partly Cloudy",
  "waterCondition": "Clear",
  "fishCaught": 6,
  "species": "Rainbow Trout, Brown Trout, Cutthroat",
  "notes": "Updated notes with more detail about the catch."
}
```

**Success Response (200 OK):**
```json
{
  "message": "Experience updated successfully",
  "experience": {
    "id": 1,
    "userId": 1,
    "streamName": "Rock Creek",
    "location": "Montana, USA",
    "date": "2024-01-15T00:00:00.000Z",
    "weather": "Partly Cloudy",
    "waterCondition": "Clear",
    "fishCaught": 6,
    "species": "Rainbow Trout, Brown Trout, Cutthroat",
    "notes": "Updated notes with more detail about the catch.",
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": "2024-01-15T18:45:00.000Z"
  }
}
```

**Error Responses:**

404 Not Found:
```json
{
  "error": "Experience not found"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to update experience"
}
```

---

### Delete Experience

Delete an experience.

**Endpoint:** `DELETE /experiences/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Experience ID (integer)

**Success Response (200 OK):**
```json
{
  "message": "Experience deleted successfully"
}
```

**Error Responses:**

404 Not Found:
```json
{
  "error": "Experience not found"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to delete experience"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Invalid or expired token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider implementing rate limiting in production to prevent abuse.

**Recommended limits:**
- Authentication endpoints: 5 requests per minute per IP
- Experience endpoints: 100 requests per minute per user

---

## CORS

The API supports CORS (Cross-Origin Resource Sharing) and accepts requests from any origin in development. In production, configure CORS to only allow requests from your frontend domain.

---

## Examples

### Using curl

**Register:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Create Experience:**
```bash
curl -X POST http://localhost:3001/api/experiences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "streamName": "Rock Creek",
    "location": "Montana",
    "date": "2024-01-15",
    "fishCaught": 5,
    "species": "Rainbow Trout"
  }'
```

**Get All Experiences:**
```bash
curl -X GET http://localhost:3001/api/experiences \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript (fetch)

**Register:**
```javascript
const response = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123',
    firstName: 'Test',
    lastName: 'User'
  })
});
const data = await response.json();
```

**Create Experience:**
```javascript
const response = await fetch('http://localhost:3001/api/experiences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    streamName: 'Rock Creek',
    location: 'Montana',
    date: '2024-01-15',
    fishCaught: 5,
    species: 'Rainbow Trout'
  })
});
const data = await response.json();
```

---

## Security Considerations

1. **Always use HTTPS in production** to protect tokens and sensitive data
2. **Store JWT tokens securely** - Never expose them in URLs or logs
3. **Validate all input** on both client and server sides
4. **Use environment variables** for sensitive configuration
5. **Implement rate limiting** to prevent abuse
6. **Monitor for suspicious activity** using Application Insights
7. **Keep dependencies updated** to patch security vulnerabilities
8. **Use strong JWT secrets** (minimum 32 characters, randomly generated)

---

## Database Schema Reference

### Users Table
```sql
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- bcrypt hashed
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);
```

### Experiences Table
```sql
CREATE TABLE Experiences (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    streamName VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    weather VARCHAR(100) NULL,
    waterCondition VARCHAR(100) NULL,
    fishCaught INT DEFAULT 0,
    species VARCHAR(255) NULL,
    notes TEXT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL,
    CONSTRAINT FK_Experiences_Users FOREIGN KEY (userId) 
        REFERENCES Users(id) ON DELETE CASCADE
);
```

---

## Support

For issues or questions about the API:
1. Check this documentation
2. Review the code in `backend/routes/`
3. Check server logs for error details
4. Create an issue in the GitHub repository
