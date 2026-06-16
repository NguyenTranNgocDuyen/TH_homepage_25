namespace TimesheetApi.Models
{
    public class User 
    {
        public int Id { get; set;}
        public string Username { get; set; } = string.Empty;
        public String PasswordHash { get; set; } = string.Empty; //luu mat khau da ma hoa
        public string Fullname { get; set; } = string.Empty; 
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "Employee"; //employee, manager, hradmin
        public bool isActive { get; set; } = true;
        public int? ManagerId { get; set; } //id quan li truc tiep neu co
    }
}