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
    location VARCHAR(255) NULL,
    description TEXT NULL,
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
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Weather conditions lookup table
CREATE TABLE WeatherConditions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Water conditions lookup table
CREATE TABLE WaterConditions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Create Experiences table with foreign keys to lookup tables
CREATE TABLE Experiences (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    streamId INT NULL,
    customStreamName VARCHAR(255) NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    weatherConditionId INT NULL,
    waterConditionId INT NULL,
    fishCaught INT DEFAULT 0,
    speciesId INT NULL,
    customSpecies VARCHAR(255) NULL,
    notes TEXT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL,
    CONSTRAINT FK_Experiences_Users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT FK_Experiences_Streams FOREIGN KEY (streamId) REFERENCES Streams(id),
    CONSTRAINT FK_Experiences_WeatherConditions FOREIGN KEY (weatherConditionId) REFERENCES WeatherConditions(id),
    CONSTRAINT FK_Experiences_WaterConditions FOREIGN KEY (waterConditionId) REFERENCES WaterConditions(id),
    CONSTRAINT FK_Experiences_Species FOREIGN KEY (speciesId) REFERENCES Species(id),
    -- Ensure either streamId or customStreamName is provided
    CONSTRAINT CK_Experiences_StreamName CHECK (streamId IS NOT NULL OR customStreamName IS NOT NULL),
    -- Ensure either speciesId or customSpecies is provided if fish were caught
    CONSTRAINT CK_Experiences_Species CHECK (fishCaught = 0 OR speciesId IS NOT NULL OR customSpecies IS NOT NULL)
);

-- Create indexes for better query performance
CREATE INDEX IX_Users_Email ON Users(email);
CREATE INDEX IX_Experiences_UserId ON Experiences(userId);
CREATE INDEX IX_Experiences_Date ON Experiences(date DESC);
CREATE INDEX IX_Experiences_StreamId ON Experiences(streamId);
CREATE INDEX IX_Experiences_SpeciesId ON Experiences(speciesId);
CREATE INDEX IX_Experiences_WeatherConditionId ON Experiences(weatherConditionId);
CREATE INDEX IX_Experiences_WaterConditionId ON Experiences(waterConditionId);
CREATE INDEX IX_Streams_Name ON Streams(name);
CREATE INDEX IX_Species_Name ON Species(name);

-- Insert default weather conditions
INSERT INTO WeatherConditions (name, description) VALUES
('Sunny', 'Clear skies with abundant sunshine'),
('Partly Cloudy', 'Mix of sun and clouds'),
('Cloudy', 'Overcast skies'),
('Rainy', 'Precipitation occurring'),
('Stormy', 'Severe weather with thunder and lightning'),
('Foggy', 'Reduced visibility due to fog');

-- Insert default water conditions
INSERT INTO WaterConditions (name, description) VALUES
('Clear', 'Water is clear with good visibility'),
('Slightly Murky', 'Some cloudiness in the water'),
('Murky', 'Poor water visibility'),
('High Flow', 'Water level and flow rate above normal'),
('Low Flow', 'Water level and flow rate below normal'),
('Normal Flow', 'Typical water level and flow rate');

-- Insert some common trout species
INSERT INTO Species (name, scientificName, description) VALUES
('Rainbow Trout', 'Oncorhynchus mykiss', 'Popular game fish with distinctive pink stripe'),
('Brown Trout', 'Salmo trutta', 'European species known for wariness'),
('Brook Trout', 'Salvelinus fontinalis', 'Native to eastern North America'),
('Cutthroat Trout', 'Oncorhynchus clarkii', 'Native western species with red markings'),
('Lake Trout', 'Salvelinus namaycush', 'Large cold-water species'),
('Golden Trout', 'Oncorhynchus aguabonita', 'High-altitude California native'),
('Bull Trout', 'Salvelinus confluentus', 'Large char species'),
('Dolly Varden', 'Salvelinus malma', 'Char species found in Pacific Northwest');
