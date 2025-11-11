# TU Connect

A comprehensive application for managing Trout Unlimited chapter activities, including volunteer time tracking and fishing log management.

## Features

### Volunteer Time Tracking
- Log volunteer hours for meetings, workdays, and chapter events
- Track different event types (meetings, stream restoration, education, fundraising)
- Generate volunteer time summaries and reports by member
- View volunteer history and contributions

### Trout Fishing Log Management
- Record fishing trips with detailed information
- Track trout species, catch counts, and fish sizes
- Document water conditions, weather, and techniques used
- Generate fishing statistics and summaries
- Track favorite fishing spots and fly patterns

## Technology Stack

### Backend
- **ASP.NET Core Web API** - RESTful API for data access
- **Azure App Service** - Hosting platform for the API
- **Azure SQL Database** - Relational database for data storage
- **Azure API Management** - API gateway and management
- **Entity Framework Core** - ORM for database access

### Mobile App
- **.NET MAUI** - Cross-platform mobile application framework
- **MVVM Pattern** - Using CommunityToolkit.Mvvm
- **Supports:** Android, iOS, macOS, Windows

### Azure Services
- **Azure App Configuration** - Feature flag management
- **Azure Application Insights** - Application monitoring and telemetry
- **SQL Database Project (DACPAC)** - Database schema management and deployment

## Project Structure

```
TUConnect/
├── TUConnect.Api/              # ASP.NET Core Web API
│   ├── Controllers/            # API controllers
│   ├── Program.cs             # API configuration
│   └── appsettings.json       # Configuration
├── TUConnect.Core/            # Shared domain models
│   └── Models/                # Entity models
├── TUConnect.Data/            # Data access layer
│   └── TUConnectDbContext.cs # EF Core DbContext
├── TUConnect.Database/        # SQL Database Project
│   └── Tables/                # Table definitions
└── TUConnect.Mobile/          # .NET MAUI Mobile App
    ├── Views/                 # XAML views
    ├── ViewModels/            # View models
    └── Services/              # API services
```

## Getting Started

### Prerequisites
- .NET 9.0 SDK or later
- Visual Studio 2022 (with MAUI workload) or VS Code
- SQL Server or Azure SQL Database
- Azure subscription (for Azure services)

### Database Setup

1. Update the connection string in `TUConnect.Api/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=your-server;Database=TUConnect;..."
}
```

2. Apply migrations (or deploy DACPAC):
```bash
cd TUConnect.Data
dotnet ef migrations add InitialCreate --startup-project ../TUConnect.Api
dotnet ef database update --startup-project ../TUConnect.Api
```

### Running the API

```bash
cd TUConnect.Api
dotnet run
```

The API will be available at `https://localhost:7001` (or configured port).

### Running the Mobile App

```bash
cd TUConnect.Mobile
dotnet build -f net9.0-android  # For Android
dotnet build -f net9.0-ios      # For iOS
# Or run from Visual Studio
```

### Azure Configuration

#### App Configuration (Feature Flags)
1. Create an Azure App Configuration resource
2. Add the connection string to `appsettings.json`:
```json
"ConnectionStrings": {
  "AppConfiguration": "Endpoint=https://your-appconfig.azconfig.io;..."
}
```

3. Configure feature flags in Azure Portal:
   - `VolunteerTimeTracking` - Enable/disable volunteer time features
   - `FishingLogs` - Enable/disable fishing log features

#### Application Insights
1. Create an Application Insights resource
2. Add the connection string to `appsettings.json`:
```json
"ApplicationInsights": {
  "ConnectionString": "InstrumentationKey=...;IngestionEndpoint=..."
}
```

#### Azure SQL Database
1. Create an Azure SQL Database
2. Deploy the database schema using DACPAC:
```bash
SqlPackage /Action:Publish /SourceFile:TUConnect.Database.dacpac /TargetServerName:your-server.database.windows.net /TargetDatabaseName:TUConnect
```

#### API Management
1. Create an API Management instance
2. Import the API using OpenAPI/Swagger definition
3. Configure policies for rate limiting, authentication, etc.

## API Endpoints

### Members
- `GET /api/members` - Get all members
- `GET /api/members/{id}` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/{id}` - Update member
- `DELETE /api/members/{id}` - Delete member

### Volunteer Time
- `GET /api/volunteertime` - Get all volunteer time entries
- `GET /api/volunteertime/{id}` - Get entry by ID
- `GET /api/volunteertime/member/{memberId}` - Get entries by member
- `GET /api/volunteertime/member/{memberId}/summary` - Get member summary
- `POST /api/volunteertime` - Create new entry
- `PUT /api/volunteertime/{id}` - Update entry
- `DELETE /api/volunteertime/{id}` - Delete entry

### Fishing Logs
- `GET /api/fishinglogs` - Get all fishing logs
- `GET /api/fishinglogs/{id}` - Get log by ID
- `GET /api/fishinglogs/member/{memberId}` - Get logs by member
- `GET /api/fishinglogs/member/{memberId}/stats` - Get member statistics
- `POST /api/fishinglogs` - Create new log
- `PUT /api/fishinglogs/{id}` - Update log
- `DELETE /api/fishinglogs/{id}` - Delete log

## Database Schema

### Members Table
- Stores member information (name, email, phone, join date)

### VolunteerTimeEntries Table
- Tracks volunteer activities
- Links to Members table
- Records event type, date, hours, location, and description

### FishingLogs Table
- Records fishing trips
- Links to Members table
- Includes location, species, catch data, conditions, and notes

## Development

### Adding EF Core Migrations

```bash
cd TUConnect.Data
dotnet ef migrations add YourMigrationName --startup-project ../TUConnect.Api
dotnet ef database update --startup-project ../TUConnect.Api
```

### Testing the API

The API includes Swagger UI for testing:
- Navigate to `https://localhost:7001/swagger` when running in development mode

### Mobile App Development

The mobile app uses MVVM pattern with:
- ViewModels for business logic
- Views (XAML) for UI
- Services for API communication
- Dependency injection for loose coupling

## Deployment

### API Deployment to Azure App Service

```bash
cd TUConnect.Api
dotnet publish -c Release
# Deploy using Azure CLI or Visual Studio
```

### Database Deployment

Use DACPAC deployment or EF Core migrations:
```bash
dotnet ef database update --connection "your-production-connection-string"
```

### Mobile App Deployment

- **Android:** Build APK/AAB and publish to Google Play Store
- **iOS:** Build IPA and publish to Apple App Store
- **Windows:** Build MSIX and distribute via Microsoft Store

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please use the GitHub issue tracker.