using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimesheetApi.Data;
using TimesheetApi.Models;

namespace TimesheetApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LeaveRequestsController : ControllerBase
{
    private readonly TimesheetDbContext _context;

    public LeaveRequestsController(TimesheetDbContext context)
    {
        _context = context;
    }

    // GET: api/LeaveRequests
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaveRequests()
    {
        return await _context.LeaveRequests.ToListAsync();
    }

    // GET: api/LeaveRequests/5
    [HttpGet("{id}")]
    public async Task<ActionResult<LeaveRequest>> GetLeaveRequest(int id)
    {
        var leaveRequest = await _context.LeaveRequests.FindAsync(id);

        if (leaveRequest == null)
        {
            return NotFound();
        }

        return leaveRequest;
    }

    // POST: api/LeaveRequests
    [HttpPost]
    public async Task<ActionResult<LeaveRequest>> PostLeaveRequest(LeaveRequest leaveRequest)
    {
        _context.LeaveRequests.Add(leaveRequest);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLeaveRequest), new { id = leaveRequest.Id }, leaveRequest);
    }

    // PUT: api/LeaveRequests/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutLeaveRequest(int id, LeaveRequest leaveRequest)
    {
        if (id != leaveRequest.Id)
        {
            return BadRequest();
        }

        _context.Entry(leaveRequest).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!LeaveRequestExists(id))
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

    // DELETE: api/LeaveRequests/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLeaveRequest(int id)
    {
        var leaveRequest = await _context.LeaveRequests.FindAsync(id);
        if (leaveRequest == null)
        {
            return NotFound();
        }

        _context.LeaveRequests.Remove(leaveRequest);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool LeaveRequestExists(int id)
    {
        return _context.LeaveRequests.Any(e => e.Id == id);
    }
}
