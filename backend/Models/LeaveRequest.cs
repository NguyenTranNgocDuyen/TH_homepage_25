using System;

namespace TimesheetApi.Models;

public class LeaveRequest
{
    public int Id { get; set; }
    public int UserId { get; set; } //lk voi bang user
    public User? User { get; set; }
    public string LeaveTypeId { get; set; } //lk voi bang leavetype
    public LeaveType? LeaveType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
