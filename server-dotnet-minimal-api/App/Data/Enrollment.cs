namespace LibAcct.App.Data;

public class Enrollment : IEntity
{
    public int Id { get; set; }
    public int StaffId { get; set; }
    public int EventId { get; set; }
    public DateTime EventDate { get; set; }
    public EnrollmentEvent? Event { get; set; }
    public User? Staff { get; set; }
}
