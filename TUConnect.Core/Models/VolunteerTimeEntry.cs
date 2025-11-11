namespace TUConnect.Core.Models;

/// <summary>
/// Represents a volunteer time entry for tracking member contributions
/// </summary>
public class VolunteerTimeEntry
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public DateTime EventDate { get; set; }
    public string EventType { get; set; } = string.Empty; // Meeting, Workday, StreamRestoration, etc.
    public string EventName { get; set; } = string.Empty;
    public decimal HoursWorked { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public Member Member { get; set; } = null!;
}

/// <summary>
/// Event types for volunteer activities
/// </summary>
public static class EventTypes
{
    public const string Meeting = "Meeting";
    public const string Workday = "Workday";
    public const string StreamRestoration = "StreamRestoration";
    public const string Education = "Education";
    public const string Fundraising = "Fundraising";
    public const string Other = "Other";
}
