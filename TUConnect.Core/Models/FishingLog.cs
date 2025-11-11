namespace TUConnect.Core.Models;

/// <summary>
/// Represents a trout fishing log entry
/// </summary>
public class FishingLog
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public DateTime FishingDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? StreamName { get; set; }
    public string? County { get; set; }
    public string? State { get; set; }
    
    // Fish details
    public string TroutSpecies { get; set; } = string.Empty; // Brook, Brown, Rainbow, Cutthroat, etc.
    public int FishCaught { get; set; }
    public int FishKept { get; set; }
    public decimal? LargestFishLength { get; set; } // inches
    public decimal? LargestFishWeight { get; set; } // pounds
    
    // Conditions
    public string? WaterCondition { get; set; } // Clear, Stained, Muddy
    public decimal? WaterTemperature { get; set; } // Fahrenheit
    public string? Weather { get; set; }
    
    // Methods and notes
    public string? FlyPattern { get; set; }
    public string? Technique { get; set; } // Dry fly, Nymph, Streamer, etc.
    public string? Notes { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public Member Member { get; set; } = null!;
}

/// <summary>
/// Common trout species
/// </summary>
public static class TroutSpecies
{
    public const string BrookTrout = "Brook Trout";
    public const string BrownTrout = "Brown Trout";
    public const string RainbowTrout = "Rainbow Trout";
    public const string CutthroatTrout = "Cutthroat Trout";
    public const string LakeTrout = "Lake Trout";
    public const string GoldenTrout = "Golden Trout";
}
