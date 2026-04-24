using System.ComponentModel.DataAnnotations;

namespace TimesheetLeaveApi.Models;

public class LeaveRequest
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string EmployeeName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string LeaveType { get; set; } = "Annual Leave";

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    [StringLength(500)]
    public string Reason { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; }
}
