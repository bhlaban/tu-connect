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
    startDateTime DATETIME2 NOT NULL, -- Stored in UTC
    stopDateTime DATETIME2 NOT NULL,  -- Stored in UTC
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
CREATE INDEX IX_Trips_StartDateTime ON Trips(startDateTime DESC);
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
('Brook Trout', 'Salvelinus fontinalis', 'Native to eastern North America', 1),
('Brown Trout', 'Salmo trutta', 'European species known for wariness', 2),
('Rainbow Trout', 'Oncorhynchus mykiss', 'Popular game fish with distinctive pink stripe', 3),
('Cutthroat Trout', 'Oncorhynchus clarkii', 'Native western species with red markings', 4),
('Golden Trout', 'Oncorhynchus aguabonita', 'High-altitude California native', 5),
('Bull Trout', 'Salvelinus confluentus', 'Large char species', 6);

-- Insert all known trout streams in Wisconsin (comprehensive list)
INSERT INTO Streams (name, description) VALUES
-- NORTHERN WISCONSIN STREAMS
('Bois Brule River', 'Premier trout stream in Douglas County, flows into Lake Superior'),
('Popple River', 'Remote wilderness stream in Florence County'),
('Pine River (Florence County)', 'Wild river in Florence County'),
('Wolf River', 'Major river system in northeastern Wisconsin'),
('Namekagon River', 'Scenic river in Bayfield and Sawyer counties'),
('Peshtigo River', 'Quality trout water in Marinette and Oconto counties'),
('Oconto River', 'Class I trout water in Oconto County'),
('Prairie River', 'Northern Wisconsin stream in Lincoln County'),
('Eau Claire River (Bayfield County)', 'Class I stream in Bayfield County'),
('Flag River', 'Trout stream in Iron County'),
('Iron River', 'Northern stream in Bayfield and Iron counties'),
('Sioux River', 'Wild river in Bayfield County'),
('White River (Bayfield County)', 'Northern trout stream in Bayfield County'),
('Amnicon River', 'Stream in Douglas County'),
('Totagatic River', 'Bayfield County trout stream'),
('Bad River', 'Ashland and Iron counties stream'),
('Marengo River', 'Ashland County stream'),
('Montreal River', 'Iron County border stream'),
('Tyler Forks', 'Tributary of Bad River in Ashland County'),
('Pine Creek (Price County)', 'Northern trout stream'),
('South Fork Flambeau River', 'Price County stream'),
('Jump River', 'Taylor County trout water'),
('Chippewa River (Sawyer County)', 'Northern headwaters stream'),

-- CENTRAL WISCONSIN STREAMS
('Lawrence Creek', 'Class I stream in Marquette County'),
('Mecan River', 'Spring-fed stream in Marquette and Waushara counties'),
('White River (Waushara County)', 'Class I stream in Waushara County'),
('Plover River', 'Trout stream in Marathon and Portage counties'),
('Tomorrow River', 'Quality stream in Portage County'),
('Waupaca River', 'Scenic stream in Waupaca County'),
('Little Wolf River', 'Waupaca County stream'),
('Embarrass River', 'Central Wisconsin stream'),
('Big Eau Pleine River', 'Marathon County stream'),
('Rib River', 'Marathon County trout water'),
('Eau Claire River (Marathon County)', 'Central stream'),
('Pine River (Waushara County)', 'Class I stream'),
('Chaffee Creek', 'Marquette and Waushara counties'),
('Lunch Creek', 'Marquette and Waushara counties'),
('Little Pine Creek', 'Marquette and Waushara counties'),
('Big Roche A Cri Creek', 'Adams and Waushara counties'),
('Carter Creek', 'Adams and Waushara counties'),
('Bird Creek', 'Waushara County'),
('Cedar Spring Creek', 'Waushara County'),
('Davies Creek', 'Waushara County'),
('Kaminski Creek', 'Waushara County'),
('Popple Creek (Waushara County)', 'Central Wisconsin stream'),
('Soules Creek', 'Waushara County'),

-- DRIFTLESS AREA - SOUTHWESTERN WISCONSIN
('Kickapoo River', 'Major trout river in Vernon County'),
('West Fork Kickapoo River', 'Premier spring creek in Vernon County'),
('Timber Coulee Creek', 'Class I spring creek in Vernon County'),
('Coon Creek', 'Vernon County stream'),
('Tainter Creek', 'Vernon County'),
('Knapp Creek', 'Vernon County'),
('Middle Creek', 'Vernon County'),
('Billings Creek', 'Vernon County'),
('Springville Branch', 'Vernon County'),
('Castle Rock Creek', 'High-quality spring creek in Grant County'),
('Blue River', 'Grant County Class I stream'),
('Big Green River', 'Grant County'),
('Little Green River', 'Grant County'),
('Fennimore Fork', 'Grant County'),
('Pigeon Creek', 'Grant County'),
('Rattlesnake Creek', 'Grant County'),
('Willow Creek (Richland County)', 'Class I stream in Richland County'),
('Pine River (Richland County)', 'Richland County stream'),
('Mill Creek', 'Richland County'),
('Ash Creek', 'Richland County'),
('Big Creek', 'Richland County'),
('Crooked Creek', 'Richland County'),
('Otter Creek (Richland County)', 'Richland County'),
('Rush Creek', 'Spring-fed stream in Crawford County'),
('Bishop Branch', 'Crawford County'),
('Reads Creek', 'Crawford County'),
('Spring Creek (Crawford County)', 'Crawford County'),
('Copper Creek', 'Crawford County'),
('Tainter Branch', 'Crawford County'),
('Black Earth Creek', 'Iowa County Class I stream'),
('Gordon Creek', 'Iowa County'),
('Otter Creek (Iowa County)', 'Iowa County'),
('Trout Creek', 'Iowa County'),
('Mineral Point Branch', 'Iowa County'),
('Pecatonica River', 'Iowa and Lafayette counties'),

-- SOUTHEASTERN WISCONSIN STREAMS
('Kinnickinnic River', 'Class I stream in Pierce and St. Croix counties'),
('Rush River', 'Pierce County'),
('Tiffany Creek', 'Pierce County'),
('Willow River', 'St. Croix County'),
('Trout Brook', 'Pierce County'),

-- NORTHEASTERN WISCONSIN STREAMS
('Pensaukee River', 'Oconto County'),
('North Branch Oconto River', 'Oconto County'),
('South Branch Oconto River', 'Oconto County'),
('Stony Creek', 'Oconto County'),
('Lawrence Creek (Brown County)', 'Brown County'),
('Duck Creek', 'Brown County'),

-- ADDITIONAL NOTABLE STREAMS
('Baraboo River', 'Sauk County'),
('Dell Creek', 'Sauk and Adams counties'),
('Richland Creek', 'Richland County'),
('Brush Creek', 'Crawford County'),
('Timber Creek', 'Crawford County'),
('Coon Valley Creek', 'Vernon County'),
('Bohemian Valley Creek', 'Vernon County'),
('South Fork Bad Axe River', 'Vernon County'),
('North Fork Bad Axe River', 'Vernon County'),
('Bruce Valley Creek', 'Crawford County'),
('Fly Creek', 'Trempealeau County'),
('Elk Creek', 'Trempealeau County'),
('Pigeon Creek (Trempealeau County)', 'Trempealeau County'),
('Freeman Creek', 'Crawford County'),
('Dutch Hollow Creek', 'Crawford County'),
('Eagle Creek', 'Richland County'),
('Rowan Creek', 'Crawford County'),
('Hay Creek', 'Dunn County'),
('Arkansaw Creek', 'Pepin County'),
('Little Plover River', 'Portage County'),
('Ten Mile Creek', 'Marathon County'),
('Big Sandy Creek', 'Marathon County'),
('Trail Creek', 'Clark County'),
('East Fork Black River', 'Taylor County'),
('Poplar Creek', 'Douglas County'),
('Schultz Creek', 'Douglas County');
