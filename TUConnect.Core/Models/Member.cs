namespace TUConnect.Core.Models;

/// <summary>
/// Represents a chapter member
/// </summary>
public class Member
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime JoinDate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<VolunteerTimeEntry> VolunteerTimeEntries { get; set; } = new List<VolunteerTimeEntry>();
    public ICollection<FishingLog> FishingLogs { get; set; } = new List<FishingLog>();
}
