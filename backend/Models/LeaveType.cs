namespace TimesheetApi.Models
{
    public class LeaveType 
    {
        public int Id { get; set }
        public string Name { get; set; } = string.Empty; //nghi om, phep nam
        public int DefaultDays { get; set; }//so ngay mac dinh duoc cap
    }
}