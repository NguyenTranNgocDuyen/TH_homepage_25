using System.ComponentModel.DataAnnotations;

namespace TimesheetLeaveApi.Models;

public class TimesheetEntry
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string EmployeeName { get; set; } = string.Empty;

    [Required]
    public DateTime WorkDate { get; set; }

    public DateTime? CheckInTime { get; set; }

    public DateTime? CheckOutTime { get; set; }

    [Required]
    [StringLength(30)]
    public string Status { get; set; } = "Present";

    [StringLength(500)]
    public string? Note { get; set; }
}
