namespace TimesheetApi.Models;

public class TimesheetEntry
{
    public int Id { get; set; }
    public int UserId { get; set; } //lk voi bang user
    public User? User { get; set; }
    public DateTime WorkDate { get; set; }
    public DateTime CheckInTime { get; set; }
    public DateTime CheckOutTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
}
