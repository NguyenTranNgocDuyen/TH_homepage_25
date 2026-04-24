using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimesheetLeaveApi.Data;
using TimesheetLeaveApi.Models;

namespace TimesheetLeaveApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeaveRequestsController(AppDbContext context) : ControllerBase
{
    private static readonly string[] AllowedLeaveTypes = ["Annual Leave", "Sick Leave", "Unpaid Leave"];
    private static readonly string[] AllowedStatuses = ["Pending", "Approved", "Rejected"];

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaveRequests()
    {
        var leaveRequests = await context.LeaveRequests
            .AsNoTracking()
            .OrderByDescending(item => item.CreatedAt)
            .ThenBy(item => item.EmployeeName)
            .ToListAsync();

        return Ok(leaveRequests);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<LeaveRequest>> GetLeaveRequest(int id)
    {
        var leaveRequest = await context.LeaveRequests
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id);

        if (leaveRequest is null)
        {
            return NotFound(new { message = "Leave request not found." });
        }

        return Ok(leaveRequest);
    }

    [HttpPost]
    public async Task<ActionResult<LeaveRequest>> CreateLeaveRequest(LeaveRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var validationProblem = ValidateLeaveRequest(request);
        if (validationProblem is not null)
        {
            return ValidationProblem(validationProblem);
        }

        request.Id = 0;
        request.EmployeeName = request.EmployeeName.Trim();
        request.LeaveType = request.LeaveType.Trim();
        request.Reason = request.Reason.Trim();
        request.Status = request.Status.Trim();
        request.CreatedAt = DateTime.UtcNow;

        context.LeaveRequests.Add(request);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLeaveRequest), new { id = request.Id }, request);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateLeaveRequest(int id, LeaveRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var validationProblem = ValidateLeaveRequest(request);
        if (validationProblem is not null)
        {
            return ValidationProblem(validationProblem);
        }

        var existingRequest = await context.LeaveRequests.FindAsync(id);
        if (existingRequest is null)
        {
            return NotFound(new { message = "Leave request not found." });
        }

        existingRequest.EmployeeName = request.EmployeeName.Trim();
        existingRequest.LeaveType = request.LeaveType.Trim();
        existingRequest.StartDate = request.StartDate;
        existingRequest.EndDate = request.EndDate;
        existingRequest.Reason = request.Reason.Trim();
        existingRequest.Status = request.Status.Trim();
        // Keep original creation time for easy demo tracking.
        existingRequest.CreatedAt = existingRequest.CreatedAt == default ? DateTime.UtcNow : existingRequest.CreatedAt;

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteLeaveRequest(int id)
    {
        var existingRequest = await context.LeaveRequests.FindAsync(id);
        if (existingRequest is null)
        {
            return NotFound(new { message = "Leave request not found." });
        }

        context.LeaveRequests.Remove(existingRequest);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private static ValidationProblemDetails? ValidateLeaveRequest(LeaveRequest request)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.EmployeeName))
        {
            errors.Add(nameof(request.EmployeeName), ["Employee name is required."]);
        }

        if (string.IsNullOrWhiteSpace(request.Reason))
        {
            errors.Add(nameof(request.Reason), ["Reason is required."]);
        }

        if (request.StartDate == default)
        {
            errors.Add(nameof(request.StartDate), ["Start date is required."]);
        }

        if (request.EndDate == default)
        {
            errors.Add(nameof(request.EndDate), ["End date is required."]);
        }

        if (request.StartDate != default && request.EndDate != default && request.EndDate < request.StartDate)
        {
            errors.Add(nameof(request.EndDate), ["End date must be later than or equal to start date."]);
        }

        if (string.IsNullOrWhiteSpace(request.LeaveType) || !AllowedLeaveTypes.Contains(request.LeaveType.Trim()))
        {
            errors.Add(nameof(request.LeaveType), ["Leave type must be Annual Leave, Sick Leave or Unpaid Leave."]);
        }

        if (string.IsNullOrWhiteSpace(request.Status) || !AllowedStatuses.Contains(request.Status.Trim()))
        {
            errors.Add(nameof(request.Status), ["Status must be Pending, Approved or Rejected."]);
        }

        return errors.Count == 0 ? null : new ValidationProblemDetails(errors);
    }
}
