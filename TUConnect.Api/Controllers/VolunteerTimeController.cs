using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TUConnect.Core.Models;
using TUConnect.Data;

namespace TUConnect.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VolunteerTimeController : ControllerBase
{
    private readonly TUConnectDbContext _context;
    private readonly ILogger<VolunteerTimeController> _logger;

    public VolunteerTimeController(TUConnectDbContext context, ILogger<VolunteerTimeController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VolunteerTimeEntry>>> GetVolunteerTimeEntries()
    {
        return await _context.VolunteerTimeEntries
            .Include(v => v.Member)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VolunteerTimeEntry>> GetVolunteerTimeEntry(int id)
    {
        var entry = await _context.VolunteerTimeEntries
            .Include(v => v.Member)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (entry == null)
        {
            return NotFound();
        }

        return entry;
    }

    [HttpGet("member/{memberId}")]
    public async Task<ActionResult<IEnumerable<VolunteerTimeEntry>>> GetVolunteerTimeByMember(int memberId)
    {
        return await _context.VolunteerTimeEntries
            .Where(v => v.MemberId == memberId)
            .OrderByDescending(v => v.EventDate)
            .ToListAsync();
    }

    [HttpGet("member/{memberId}/summary")]
    public async Task<ActionResult<object>> GetVolunteerTimeSummary(int memberId)
    {
        var entries = await _context.VolunteerTimeEntries
            .Where(v => v.MemberId == memberId)
            .ToListAsync();

        var summary = new
        {
            TotalHours = entries.Sum(e => e.HoursWorked),
            TotalEvents = entries.Count,
            ByEventType = entries
                .GroupBy(e => e.EventType)
                .Select(g => new
                {
                    EventType = g.Key,
                    Hours = g.Sum(e => e.HoursWorked),
                    Count = g.Count()
                })
                .ToList()
        };

        return summary;
    }

    [HttpPost]
    public async Task<ActionResult<VolunteerTimeEntry>> PostVolunteerTimeEntry(VolunteerTimeEntry entry)
    {
        entry.CreatedAt = DateTime.UtcNow;
        _context.VolunteerTimeEntries.Add(entry);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetVolunteerTimeEntry), new { id = entry.Id }, entry);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutVolunteerTimeEntry(int id, VolunteerTimeEntry entry)
    {
        if (id != entry.Id)
        {
            return BadRequest();
        }

        entry.UpdatedAt = DateTime.UtcNow;
        _context.Entry(entry).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!VolunteerTimeEntryExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVolunteerTimeEntry(int id)
    {
        var entry = await _context.VolunteerTimeEntries.FindAsync(id);
        if (entry == null)
        {
            return NotFound();
        }

        _context.VolunteerTimeEntries.Remove(entry);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool VolunteerTimeEntryExists(int id)
    {
        return _context.VolunteerTimeEntries.Any(e => e.Id == id);
    }
}
