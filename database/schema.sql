-- TU Connect Database Schema for Azure SQL Database

-- Create Users table
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Create lookup tables for standardized data

-- Streams lookup table
CREATE TABLE Streams (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    displayOrder INT NOT NULL DEFAULT 999,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Species lookup table
CREATE TABLE Species (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    scientificName VARCHAR(255) NULL,
    description TEXT NULL,
    displayOrder INT NOT NULL DEFAULT 999,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Weather conditions lookup table
CREATE TABLE WeatherConditions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    displayOrder INT NOT NULL DEFAULT 999,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Water clarity conditions lookup table
CREATE TABLE WaterClarityConditions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    displayOrder INT NOT NULL DEFAULT 999,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Water level conditions lookup table
CREATE TABLE WaterLevelConditions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    displayOrder INT NOT NULL DEFAULT 999,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Create Trips table (renamed from Experiences)
CREATE TABLE Trips (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    streamId INT NOT NULL,
    location VARCHAR(255) NULL,
    date DATE NOT NULL,
    startTime TIME NULL,
    stopTime TIME NULL,
    weatherConditionId INT NULL,
    waterClarityConditionId INT NULL,
    waterLevelConditionId INT NULL,
    notes TEXT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL,
    CONSTRAINT FK_Trips_Users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT FK_Trips_Streams FOREIGN KEY (streamId) REFERENCES Streams(id),
    CONSTRAINT FK_Trips_WeatherConditions FOREIGN KEY (weatherConditionId) REFERENCES WeatherConditions(id),
    CONSTRAINT FK_Trips_WaterClarityConditions FOREIGN KEY (waterClarityConditionId) REFERENCES WaterClarityConditions(id),
    CONSTRAINT FK_Trips_WaterLevelConditions FOREIGN KEY (waterLevelConditionId) REFERENCES WaterLevelConditions(id)
);

-- Create Catches table (one catch per entry, no quantity)
CREATE TABLE Catches (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tripId INT NOT NULL,
    speciesId INT NOT NULL,
    length DECIMAL(5,2) NULL,
    notes TEXT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL,
    CONSTRAINT FK_Catches_Trips FOREIGN KEY (tripId) REFERENCES Trips(id) ON DELETE CASCADE,
    CONSTRAINT FK_Catches_Species FOREIGN KEY (speciesId) REFERENCES Species(id)
);

-- Create indexes for better query performance
CREATE INDEX IX_Users_Email ON Users(email);
CREATE INDEX IX_Trips_UserId ON Trips(userId);
CREATE INDEX IX_Trips_Date ON Trips(date DESC);
CREATE INDEX IX_Trips_StreamId ON Trips(streamId);
CREATE INDEX IX_Trips_WeatherConditionId ON Trips(weatherConditionId);
CREATE INDEX IX_Trips_WaterClarityConditionId ON Trips(waterClarityConditionId);
CREATE INDEX IX_Trips_WaterLevelConditionId ON Trips(waterLevelConditionId);
CREATE INDEX IX_Catches_TripId ON Catches(tripId);
CREATE INDEX IX_Catches_SpeciesId ON Catches(speciesId);
CREATE INDEX IX_Streams_Name ON Streams(name);
CREATE INDEX IX_Species_Name ON Species(name);

-- Insert default weather conditions
INSERT INTO WeatherConditions (name, description, displayOrder) VALUES
('Sunny', 'Clear skies with abundant sunshine', 1),
('Partly Cloudy', 'Mix of sun and clouds', 2),
('Cloudy', 'Overcast skies', 3),
('Rainy', 'Precipitation occurring', 4),
('Stormy', 'Severe weather with thunder and lightning', 5),
('Foggy', 'Reduced visibility due to fog', 6);

-- Insert default water clarity conditions
INSERT INTO WaterClarityConditions (name, description, displayOrder) VALUES
('Clear', 'Water is clear with good visibility', 1),
('Slightly Murky', 'Some cloudiness in the water', 2),
('Murky', 'Poor water visibility', 3),
('Very Murky', 'Very poor water visibility', 4);

-- Insert default water level conditions
INSERT INTO WaterLevelConditions (name, description, displayOrder) VALUES
('Low', 'Water level below normal', 1),
('Normal', 'Typical water level', 2),
('High', 'Water level above normal', 3),
('Flood Stage', 'Water at or near flood stage', 4);

-- Insert some common trout species
INSERT INTO Species (name, scientificName, description, displayOrder) VALUES
('Rainbow Trout', 'Oncorhynchus mykiss', 'Popular game fish with distinctive pink stripe', 1),
('Brown Trout', 'Salmo trutta', 'European species known for wariness', 2),
('Brook Trout', 'Salvelinus fontinalis', 'Native to eastern North America', 3),
('Cutthroat Trout', 'Oncorhynchus clarkii', 'Native western species with red markings', 4),
('Golden Trout', 'Oncorhynchus aguabonita', 'High-altitude California native', 5),
('Bull Trout', 'Salvelinus confluentus', 'Large char species', 6);
