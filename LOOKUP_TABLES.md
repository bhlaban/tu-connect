# Lookup Tables Overview

This document provides an overview of the lookup tables added to standardize data entry in TU Connect.

## Purpose

Lookup tables provide:
- **Data Consistency**: Standardized values across all user entries
- **Data Quality**: Reduced typos and variations in naming
- **Reporting**: Easier to aggregate and analyze data
- **User Experience**: Dropdown selections are faster than typing
- **Flexibility**: Users can still enter custom values when needed

## Database Schema

### Lookup Tables Structure

All lookup tables follow a consistent structure:

```sql
CREATE TABLE [LookupTableName] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    [additional fields like scientificName, description],
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);
```

The `isActive` field allows soft-deletion of lookup values without breaking foreign key relationships.

## Lookup Tables

### 1. Streams Table

Stores standardized stream names with optional location and description.

**Schema:**
```sql
CREATE TABLE Streams (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) NULL,
    description TEXT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);
```

**Example Data:**
| id | name | location | description |
|----|------|----------|-------------|
| 1 | Rock Creek | Montana | Famous Montana trout stream |
| 2 | Silver Creek | Idaho | Spring creek in southern Idaho |
| 3 | Madison River | Montana | Legendary blue-ribbon trout stream |

**Usage:**
- Users select from dropdown when logging experiences
- Custom stream names can be entered if not in list
- `Experiences.streamId` references `Streams.id`
- Custom names stored in `Experiences.customStreamName`

---

### 2. Species Table

Stores fish species with common and scientific names.

**Schema:**
```sql
CREATE TABLE Species (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    scientificName VARCHAR(255) NULL,
    description TEXT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);
```

**Pre-populated Data:**
| id | name | scientificName | description |
|----|------|----------------|-------------|
| 1 | Rainbow Trout | Oncorhynchus mykiss | Popular game fish with distinctive pink stripe |
| 2 | Brown Trout | Salmo trutta | European species known for wariness |
| 3 | Brook Trout | Salvelinus fontinalis | Native to eastern North America |
| 4 | Cutthroat Trout | Oncorhynchus clarkii | Native western species with red markings |
| 5 | Lake Trout | Salvelinus namaycush | Large cold-water species |
| 6 | Golden Trout | Oncorhynchus aguabonita | High-altitude California native |
| 7 | Bull Trout | Salvelinus confluentus | Large char species |
| 8 | Dolly Varden | Salvelinus malma | Char species found in Pacific Northwest |

**Usage:**
- Dropdown shows: "Rainbow Trout (Oncorhynchus mykiss)"
- Users can enter custom species if catching something not listed
- `Experiences.speciesId` references `Species.id`
- Custom species stored in `Experiences.customSpecies`

---

### 3. WeatherConditions Table

Stores standardized weather condition descriptions.

**Schema:**
```sql
CREATE TABLE WeatherConditions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);
```

**Pre-populated Data:**
| id | name | description |
|----|------|-------------|
| 1 | Sunny | Clear skies with abundant sunshine |
| 2 | Partly Cloudy | Mix of sun and clouds |
| 3 | Cloudy | Overcast skies |
| 4 | Rainy | Precipitation occurring |
| 5 | Stormy | Severe weather with thunder and lightning |
| 6 | Foggy | Reduced visibility due to fog |

**Usage:**
- Dropdown selection (no custom entry for weather)
- `Experiences.weatherConditionId` references `WeatherConditions.id`
- Optional field (can be left blank)

---

### 4. WaterConditions Table

Stores standardized water condition descriptions.

**Schema:**
```sql
CREATE TABLE WaterConditions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL
);
```

**Pre-populated Data:**
| id | name | description |
|----|------|-------------|
| 1 | Clear | Water is clear with good visibility |
| 2 | Slightly Murky | Some cloudiness in the water |
| 3 | Murky | Poor water visibility |
| 4 | High Flow | Water level and flow rate above normal |
| 5 | Low Flow | Water level and flow rate below normal |
| 6 | Normal Flow | Typical water level and flow rate |

**Usage:**
- Dropdown selection (no custom entry for water conditions)
- `Experiences.waterConditionId` references `WaterConditions.id`
- Optional field (can be left blank)

---

## Experiences Table Changes

The `Experiences` table was modified to support lookup tables:

**Old Schema:**
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
    ...
);
```

**New Schema:**
```sql
CREATE TABLE Experiences (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    streamId INT NULL,                    -- FK to Streams
    customStreamName VARCHAR(255) NULL,   -- Custom stream name
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    weatherConditionId INT NULL,          -- FK to WeatherConditions
    waterConditionId INT NULL,            -- FK to WaterConditions
    fishCaught INT DEFAULT 0,
    speciesId INT NULL,                   -- FK to Species
    customSpecies VARCHAR(255) NULL,      -- Custom species
    notes TEXT NULL,
    ...
    CONSTRAINT FK_Experiences_Streams FOREIGN KEY (streamId) REFERENCES Streams(id),
    CONSTRAINT FK_Experiences_WeatherConditions FOREIGN KEY (weatherConditionId) REFERENCES WeatherConditions(id),
    CONSTRAINT FK_Experiences_WaterConditions FOREIGN KEY (waterConditionId) REFERENCES WaterConditions(id),
    CONSTRAINT FK_Experiences_Species FOREIGN KEY (speciesId) REFERENCES Species(id),
    CONSTRAINT CK_Experiences_StreamName CHECK (streamId IS NOT NULL OR customStreamName IS NOT NULL),
    CONSTRAINT CK_Experiences_Species CHECK (fishCaught = 0 OR speciesId IS NOT NULL OR customSpecies IS NOT NULL)
);
```

**Key Changes:**
- Replaced text fields with foreign keys to lookup tables
- Added custom fields for streams and species
- Added check constraints to ensure data integrity
- Both lookup ID and custom value cannot be null where applicable

---

## API Endpoints

### Get All Lookup Data
```
GET /api/lookups/all
```

Returns all lookup tables in one call (efficient for form initialization):

```json
{
  "streams": [
    { "id": 1, "name": "Rock Creek", "location": "Montana", "description": "..." }
  ],
  "species": [
    { "id": 1, "name": "Rainbow Trout", "scientificName": "Oncorhynchus mykiss", "description": "..." }
  ],
  "weatherConditions": [
    { "id": 1, "name": "Sunny", "description": "Clear skies with abundant sunshine" }
  ],
  "waterConditions": [
    { "id": 1, "name": "Clear", "description": "Water is clear with good visibility" }
  ]
}
```

### Individual Endpoints

```
GET /api/lookups/streams
GET /api/lookups/species
GET /api/lookups/weather-conditions
GET /api/lookups/water-conditions
```

Each returns only that specific lookup table data.

---

## Frontend Integration

### Form Behavior

1. **On Form Load:**
   - Fetch all lookup data via `/api/lookups/all`
   - Populate dropdown selects with lookup values

2. **Stream Selection:**
   - Checkbox: "Enter custom stream name"
   - If unchecked: Show dropdown with streams from lookup table
   - If checked: Show text input for custom stream name

3. **Species Selection:**
   - Checkbox: "Enter custom species"
   - If unchecked: Show dropdown with species from lookup table (includes scientific names)
   - If checked: Show text input for custom species

4. **Weather/Water Conditions:**
   - Always dropdowns (no custom entry)
   - Pre-populated with standard conditions

### Display Behavior

When viewing experiences, the app displays:
- `streamName` (from lookup) OR `customStreamName` (user entered)
- `speciesName` (from lookup) OR `customSpecies` (user entered)
- `weatherCondition` (from lookup)
- `waterCondition` (from lookup)

The backend JOIN query handles this automatically.

---

## Data Management

### Adding New Lookup Values

Administrators can add new lookup values directly to the database:

```sql
-- Add a new stream
INSERT INTO Streams (name, location, description)
VALUES ('Firehole River', 'Yellowstone National Park, Wyoming', 'Unique thermal stream');

-- Add a new species
INSERT INTO Species (name, scientificName)
VALUES ('Gila Trout', 'Oncorhynchus gilae');
```

### Deactivating Lookup Values

Instead of deleting, deactivate values to preserve data integrity:

```sql
UPDATE Streams SET isActive = 0 WHERE id = 5;
```

Deactivated values:
- Won't appear in new experience forms
- Are still displayed in existing experiences
- Maintain referential integrity

### Reactivating Lookup Values

```sql
UPDATE Streams SET isActive = 1, updatedAt = GETDATE() WHERE id = 5;
```

---

## Benefits of This Approach

### Data Quality
- Consistent naming across all entries
- Reduced typos and variations
- Scientific names preserved for species

### User Experience
- Faster data entry with dropdowns
- Still flexible with custom entry option
- Autocomplete-like experience

### Reporting & Analytics
- Easy to aggregate data by stream, species, etc.
- Can track most popular streams
- Can analyze catch rates by species

### Performance
- Indexed foreign keys for fast queries
- Efficient JOIN operations
- Reduced storage (IDs vs. repeated text)

### Maintenance
- Easy to add new standardized values
- Can update descriptions without touching experiences
- Soft-delete preserves historical data

---

## Future Enhancements

Possible future additions to lookup tables:

1. **Regions/States**: Geographic organization of streams
2. **Techniques**: Fly fishing techniques used (dry fly, nymph, streamer)
3. **Flies**: Specific fly patterns used
4. **Water Temperatures**: Standardized temperature ranges
5. **Moon Phases**: Track fishing conditions by moon phase
6. **Time of Day**: Morning, afternoon, evening, night
7. **Seasons**: Spring, summer, fall, winter
8. **Difficulty Ratings**: Access difficulty for streams

Each of these could follow the same pattern as existing lookup tables.

---

## Summary

The lookup tables provide a robust foundation for data standardization while maintaining flexibility for users to enter custom values when needed. The design balances:

- **Structure** (standardized data) with **Flexibility** (custom entries)
- **Performance** (indexed foreign keys) with **Usability** (simple dropdowns)
- **Data quality** (consistent values) with **User freedom** (can add new items)

This approach scales well as the application grows and provides excellent support for future reporting and analytics features.
