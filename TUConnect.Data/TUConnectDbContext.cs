using Microsoft.EntityFrameworkCore;
using TUConnect.Core.Models;

namespace TUConnect.Data;

/// <summary>
/// Database context for TU Connect application
/// </summary>
public class TUConnectDbContext : DbContext
{
    public TUConnectDbContext(DbContextOptions<TUConnectDbContext> options)
        : base(options)
    {
    }

    public DbSet<Member> Members { get; set; }
    public DbSet<VolunteerTimeEntry> VolunteerTimeEntries { get; set; }
    public DbSet<FishingLog> FishingLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Member configuration
        modelBuilder.Entity<Member>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        // VolunteerTimeEntry configuration
        modelBuilder.Entity<VolunteerTimeEntry>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EventType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.EventName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.HoursWorked).HasPrecision(5, 2);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            
            entity.HasOne(e => e.Member)
                .WithMany(m => m.VolunteerTimeEntries)
                .HasForeignKey(e => e.MemberId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.MemberId);
            entity.HasIndex(e => e.EventDate);
        });

        // FishingLog configuration
        modelBuilder.Entity<FishingLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
            entity.Property(e => e.StreamName).HasMaxLength(200);
            entity.Property(e => e.County).HasMaxLength(100);
            entity.Property(e => e.State).HasMaxLength(50);
            entity.Property(e => e.TroutSpecies).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LargestFishLength).HasPrecision(5, 2);
            entity.Property(e => e.LargestFishWeight).HasPrecision(5, 2);
            entity.Property(e => e.WaterCondition).HasMaxLength(50);
            entity.Property(e => e.WaterTemperature).HasPrecision(4, 1);
            entity.Property(e => e.Weather).HasMaxLength(100);
            entity.Property(e => e.FlyPattern).HasMaxLength(100);
            entity.Property(e => e.Technique).HasMaxLength(100);
            entity.Property(e => e.Notes).HasMaxLength(2000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.Member)
                .WithMany(m => m.FishingLogs)
                .HasForeignKey(e => e.MemberId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.MemberId);
            entity.HasIndex(e => e.FishingDate);
            entity.HasIndex(e => e.TroutSpecies);
        });
    }
}
