using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TUConnect.Core.Models;
using TUConnect.Data;

namespace TUConnect.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FishingLogsController : ControllerBase
{
    private readonly TUConnectDbContext _context;
    private readonly ILogger<FishingLogsController> _logger;

    public FishingLogsController(TUConnectDbContext context, ILogger<FishingLogsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FishingLog>>> GetFishingLogs()
    {
        return await _context.FishingLogs
            .Include(f => f.Member)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FishingLog>> GetFishingLog(int id)
    {
        var log = await _context.FishingLogs
            .Include(f => f.Member)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (log == null)
        {
            return NotFound();
        }

        return log;
    }

    [HttpGet("member/{memberId}")]
    public async Task<ActionResult<IEnumerable<FishingLog>>> GetFishingLogsByMember(int memberId)
    {
        return await _context.FishingLogs
            .Where(f => f.MemberId == memberId)
            .OrderByDescending(f => f.FishingDate)
            .ToListAsync();
    }

    [HttpGet("member/{memberId}/stats")]
    public async Task<ActionResult<object>> GetFishingStats(int memberId)
    {
        var logs = await _context.FishingLogs
            .Where(f => f.MemberId == memberId)
            .ToListAsync();

        var stats = new
        {
            TotalTrips = logs.Count,
            TotalFishCaught = logs.Sum(l => l.FishCaught),
            TotalFishKept = logs.Sum(l => l.FishKept),
            BySpecies = logs
                .GroupBy(l => l.TroutSpecies)
                .Select(g => new
                {
                    Species = g.Key,
                    Caught = g.Sum(l => l.FishCaught),
                    Trips = g.Count()
                })
                .ToList(),
            LargestFish = logs
                .Where(l => l.LargestFishLength.HasValue)
                .OrderByDescending(l => l.LargestFishLength)
                .Select(l => new
                {
                    l.FishingDate,
                    l.TroutSpecies,
                    l.LargestFishLength,
                    l.LargestFishWeight,
                    l.Location
                })
                .FirstOrDefault()
        };

        return stats;
    }

    [HttpPost]
    public async Task<ActionResult<FishingLog>> PostFishingLog(FishingLog log)
    {
        log.CreatedAt = DateTime.UtcNow;
        _context.FishingLogs.Add(log);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFishingLog), new { id = log.Id }, log);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutFishingLog(int id, FishingLog log)
    {
        if (id != log.Id)
        {
            return BadRequest();
        }

        log.UpdatedAt = DateTime.UtcNow;
        _context.Entry(log).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FishingLogExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFishingLog(int id)
    {
        var log = await _context.FishingLogs.FindAsync(id);
        if (log == null)
        {
            return NotFound();
        }

        _context.FishingLogs.Remove(log);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool FishingLogExists(int id)
    {
        return _context.FishingLogs.Any(e => e.Id == id);
    }
}
