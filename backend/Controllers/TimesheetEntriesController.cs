using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimesheetLeaveApi.Data;
using TimesheetLeaveApi.Models;

namespace TimesheetLeaveApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimesheetEntriesController(AppDbContext context) : ControllerBase
{
    private static readonly string[] AllowedStatuses = ["Present", "Late", "Absent", "EarlyLeave"];

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TimesheetEntry>>> GetTimesheetEntries()
    {
        var entries = await context.TimesheetEntries
            .AsNoTracking()
            .OrderByDescending(item => item.WorkDate)
            .ThenBy(item => item.EmployeeName)
            .ToListAsync();

        return Ok(entries);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TimesheetEntry>> GetTimesheetEntry(int id)
    {
        var entry = await context.TimesheetEntries
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id);

        if (entry is null)
        {
            return NotFound(new { message = "Timesheet entry not found." });
        }

        return Ok(entry);
    }

    [HttpPost]
    public async Task<ActionResult<TimesheetEntry>> CreateTimesheetEntry(TimesheetEntry request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var validationProblem = ValidateTimesheetEntry(request);
        if (validationProblem is not null)
        {
            return ValidationProblem(validationProblem);
        }

        request.Id = 0;
        request.EmployeeName = request.EmployeeName.Trim();
        request.Status = request.Status.Trim();
        request.Note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();
        context.TimesheetEntries.Add(request);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTimesheetEntry), new { id = request.Id }, request);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTimesheetEntry(int id, TimesheetEntry request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var validationProblem = ValidateTimesheetEntry(request);
        if (validationProblem is not null)
        {
            return ValidationProblem(validationProblem);
        }

        var existingEntry = await context.TimesheetEntries.FindAsync(id);
        if (existingEntry is null)
        {
            return NotFound(new { message = "Timesheet entry not found." });
        }

        existingEntry.EmployeeName = request.EmployeeName.Trim();
        existingEntry.WorkDate = request.WorkDate;
        existingEntry.CheckInTime = request.CheckInTime;
        existingEntry.CheckOutTime = request.CheckOutTime;
        existingEntry.Status = request.Status.Trim();
        existingEntry.Note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTimesheetEntry(int id)
    {
        var existingEntry = await context.TimesheetEntries.FindAsync(id);
        if (existingEntry is null)
        {
            return NotFound(new { message = "Timesheet entry not found." });
        }

        context.TimesheetEntries.Remove(existingEntry);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private static ValidationProblemDetails? ValidateTimesheetEntry(TimesheetEntry request)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.EmployeeName))
        {
            errors.Add(nameof(request.EmployeeName), ["Employee name is required."]);
        }

        if (request.WorkDate == default)
        {
            errors.Add(nameof(request.WorkDate), ["Work date is required."]);
        }

        if (string.IsNullOrWhiteSpace(request.Status) || !AllowedStatuses.Contains(request.Status.Trim()))
        {
            errors.Add(nameof(request.Status), ["Status must be Present, Late, Absent or EarlyLeave."]);
        }

        if (request.CheckInTime.HasValue && request.CheckOutTime.HasValue &&
            request.CheckOutTime.Value < request.CheckInTime.Value)
        {
            errors.Add(nameof(request.CheckOutTime), ["Check-out time must be later than or equal to check-in time."]);
        }

        return errors.Count == 0 ? null : new ValidationProblemDetails(errors);
    }
}
