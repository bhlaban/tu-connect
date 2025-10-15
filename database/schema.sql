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

-- Create Experiences table
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
    CONSTRAINT FK_Experiences_Users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IX_Users_Email ON Users(email);
CREATE INDEX IX_Experiences_UserId ON Experiences(userId);
CREATE INDEX IX_Experiences_Date ON Experiences(date DESC);
