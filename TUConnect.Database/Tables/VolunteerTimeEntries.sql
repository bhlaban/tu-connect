CREATE TABLE [dbo].[VolunteerTimeEntries]
(
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [MemberId] INT NOT NULL,
    [EventDate] DATETIME2 NOT NULL,
    [EventType] NVARCHAR(50) NOT NULL,
    [EventName] NVARCHAR(200) NOT NULL,
    [HoursWorked] DECIMAL(5,2) NOT NULL,
    [Description] NVARCHAR(1000) NULL,
    [Location] NVARCHAR(200) NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2 NULL,
    CONSTRAINT [FK_VolunteerTimeEntries_Members] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Members]([Id]) ON DELETE CASCADE,
    INDEX [IX_VolunteerTimeEntries_MemberId] ([MemberId]),
    INDEX [IX_VolunteerTimeEntries_EventDate] ([EventDate])
)
