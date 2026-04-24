using Microsoft.EntityFrameworkCore;
using TimesheetLeaveApi.Models;

namespace TimesheetLeaveApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TimesheetEntry> TimesheetEntries => Set<TimesheetEntry>();

    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TimesheetEntry>(entity =>
        {
            entity.Property(item => item.EmployeeName).HasMaxLength(100);
            entity.Property(item => item.Status).HasMaxLength(30);
            entity.Property(item => item.Note).HasMaxLength(500);
            entity.Property(item => item.WorkDate).HasColumnType("datetime");
            entity.Property(item => item.CheckInTime).HasColumnType("datetime");
            entity.Property(item => item.CheckOutTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<LeaveRequest>(entity =>
        {
            entity.Property(item => item.EmployeeName).HasMaxLength(100);
            entity.Property(item => item.LeaveType).HasMaxLength(50);
            entity.Property(item => item.Reason).HasMaxLength(500);
            entity.Property(item => item.Status).HasMaxLength(30);
            entity.Property(item => item.StartDate).HasColumnType("datetime");
            entity.Property(item => item.EndDate).HasColumnType("datetime");
            entity.Property(item => item.CreatedAt).HasColumnType("datetime");
        });
    }
}
