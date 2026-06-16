using Microsoft.EntityFrameworkCore;
using TimesheetApi.Models;

namespace TimesheetApi.Data;

public class TimesheetDbContext : DbContext
{
    public TimesheetDbContext(DbContextOptions<TimesheetDbContext> options)
        : base(options)
    {
    }

    public DbSet<TimesheetEntry> Timesheets { get; set; } = null!;
    public DbSet<LeaveRequest> LeaveRequests { get; set; } = null!;
    public DbSet<User> Users { get; set; }
    public DbSet<LeaveType> LeaveTypes { get; set; }
}
