using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimesheetApi.Data;
using TimesheetApi.Models;

namespace TimesheetApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TimesheetsController : ControllerBase
{
    private readonly TimesheetDbContext _context;

    public TimesheetsController(TimesheetDbContext context)
    {
        _context = context;
    }

    // GET: api/Timesheets
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TimesheetEntry>>> GetTimesheets()
    {
        return await _context.Timesheets.ToListAsync();
    }

    // GET: api/Timesheets/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TimesheetEntry>> GetTimesheetEntry(int id)
    {
        var timesheetEntry = await _context.Timesheets.FindAsync(id);

        if (timesheetEntry == null)
        {
            return NotFound();
        }

        return timesheetEntry;
    }

    // POST: api/Timesheets
    [HttpPost]
    public async Task<ActionResult<TimesheetEntry>> PostTimesheetEntry(TimesheetEntry timesheetEntry)
    {
        _context.Timesheets.Add(timesheetEntry);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTimesheetEntry), new { id = timesheetEntry.Id }, timesheetEntry);
    }

    // PUT: api/Timesheets/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTimesheetEntry(int id, TimesheetEntry timesheetEntry)
    {
        if (id != timesheetEntry.Id)
        {
            return BadRequest();
        }

        _context.Entry(timesheetEntry).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TimesheetEntryExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Timesheets/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTimesheetEntry(int id)
    {
        var timesheetEntry = await _context.Timesheets.FindAsync(id);
        if (timesheetEntry == null)
        {
            return NotFound();
        }

        _context.Timesheets.Remove(timesheetEntry);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TimesheetEntryExists(int id)
    {
        return _context.Timesheets.Any(e => e.Id == id);
    }
}
