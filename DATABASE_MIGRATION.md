# Database Migration Guide

This guide helps you migrate from the old schema (without lookup tables) to the new schema (with lookup tables).

## For New Installations

If you're setting up TU Connect for the first time, simply run the `database/schema.sql` file against your Azure SQL Database. It includes all lookup tables and pre-populated data.

## For Existing Installations

If you already have a TU Connect database with the old schema, follow these steps to migrate to the new schema with lookup tables.

### Step 1: Backup Your Database

**IMPORTANT:** Always backup your database before making schema changes!

```sql
-- Create a backup using Azure Portal or Azure CLI
-- Or export data to save manually
```

### Step 2: Create Lookup Tables

Run these SQL statements to create the new lookup tables:

```sql
-- Create Streams lookup table
CREATE TABLE Streams (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) NULL,
    description TEXT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Create Species lookup table
CREATE TABLE Species (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    scientificName VARCHAR(255) NULL,
    description TEXT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Create Weather conditions lookup table
CREATE TABLE WeatherConditions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);

-- Create Water conditions lookup table
CREATE TABLE WaterConditions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);
```

### Step 3: Populate Lookup Tables

Insert default data into the lookup tables:

```sql
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

-- Insert common trout species
INSERT INTO Species (name, scientificName, description) VALUES
('Rainbow Trout', 'Oncorhynchus mykiss', 'Popular game fish with distinctive pink stripe'),
('Brown Trout', 'Salmo trutta', 'European species known for wariness'),
('Brook Trout', 'Salvelinus fontinalis', 'Native to eastern North America'),
('Cutthroat Trout', 'Oncorhynchus clarkii', 'Native western species with red markings'),
('Lake Trout', 'Salvelinus namaycush', 'Large cold-water species'),
('Golden Trout', 'Oncorhynchus aguabonita', 'High-altitude California native'),
('Bull Trout', 'Salvelinus confluentus', 'Large char species'),
('Dolly Varden', 'Salvelinus malma', 'Char species found in Pacific Northwest');
```

### Step 4: Populate Streams from Existing Data

Extract unique stream names from existing experiences and add them to the Streams table:

```sql
-- Insert unique streams from existing experiences
INSERT INTO Streams (name, location)
SELECT DISTINCT streamName, location
FROM Experiences
WHERE streamName IS NOT NULL
GROUP BY streamName, location;
```

### Step 5: Migrate Existing Experiences Data

Create a new Experiences table with the updated schema:

```sql
-- Rename old table
EXEC sp_rename 'Experiences', 'Experiences_OLD';

-- Create new Experiences table
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
    CONSTRAINT CK_Experiences_StreamName CHECK (streamId IS NOT NULL OR customStreamName IS NOT NULL),
    CONSTRAINT CK_Experiences_Species CHECK (fishCaught = 0 OR speciesId IS NOT NULL OR customSpecies IS NOT NULL)
);

-- Migrate data from old table to new table
INSERT INTO Experiences (
    userId, 
    streamId, 
    location, 
    date, 
    weatherConditionId, 
    waterConditionId, 
    fishCaught, 
    customSpecies, 
    notes, 
    createdAt, 
    updatedAt
)
SELECT 
    e.userId,
    s.id as streamId,
    e.location,
    e.date,
    wc.id as weatherConditionId,
    wtc.id as waterConditionId,
    e.fishCaught,
    e.species as customSpecies,
    e.notes,
    e.createdAt,
    e.updatedAt
FROM Experiences_OLD e
LEFT JOIN Streams s ON e.streamName = s.name
LEFT JOIN WeatherConditions wc ON e.weather = wc.name
LEFT JOIN WaterConditions wtc ON e.waterCondition = wtc.name;

-- Verify migration
SELECT COUNT(*) as OldCount FROM Experiences_OLD;
SELECT COUNT(*) as NewCount FROM Experiences;

-- If counts match and data looks good, you can drop the old table
-- DROP TABLE Experiences_OLD;
```

### Step 6: Create Indexes

Add indexes for better query performance:

```sql
CREATE INDEX IX_Experiences_StreamId ON Experiences(streamId);
CREATE INDEX IX_Experiences_SpeciesId ON Experiences(speciesId);
CREATE INDEX IX_Experiences_WeatherConditionId ON Experiences(weatherConditionId);
CREATE INDEX IX_Experiences_WaterConditionId ON Experiences(waterConditionId);
CREATE INDEX IX_Streams_Name ON Streams(name);
CREATE INDEX IX_Species_Name ON Species(name);
```

### Step 7: Update Application Code

Deploy the updated application code that includes:
- New lookup API endpoints
- Updated experience endpoints that handle lookup IDs
- Frontend with dropdown selects for lookup data

### Step 8: Test

1. Try logging in to the application
2. Create a new experience using the dropdown selects
3. Edit an existing experience
4. Verify that old experiences display correctly
5. Test custom stream/species entry

## Rolling Back

If you need to roll back to the old schema:

1. Restore from your backup, OR
2. Keep the `Experiences_OLD` table and:
   ```sql
   DROP TABLE Experiences;
   EXEC sp_rename 'Experiences_OLD', 'Experiences';
   ```
3. Deploy the previous version of the application code

## Adding More Lookup Data

### Add a New Stream

```sql
INSERT INTO Streams (name, location, description)
VALUES ('Rock Creek', 'Montana', 'Famous Montana trout stream');
```

### Add a New Species

```sql
INSERT INTO Species (name, scientificName, description)
VALUES ('Apache Trout', 'Oncorhynchus apache', 'Native Arizona trout');
```

### Deactivate a Lookup Entry

Instead of deleting, deactivate entries:

```sql
UPDATE Streams SET isActive = 0 WHERE id = 5;
```

## Troubleshooting

### Foreign Key Constraint Errors

If you get foreign key constraint errors during migration:

1. Check that all lookup tables are created
2. Ensure lookup data is populated
3. Verify that the JOIN conditions in the migration query are correct

### Missing Data After Migration

If experiences are missing data after migration:

1. Check the `Experiences_OLD` table for the original data
2. Review the migration query to ensure all columns are mapped
3. Manually update any records that didn't migrate correctly

### Performance Issues

If queries are slow after migration:

1. Ensure all indexes are created (Step 6)
2. Update statistics: `UPDATE STATISTICS Experiences`
3. Consider adding more indexes based on your query patterns

## Support

For issues during migration:
1. Check the migration logs for errors
2. Review the data in both old and new tables
3. Consult the main README.md for application setup
4. Create an issue in the GitHub repository
