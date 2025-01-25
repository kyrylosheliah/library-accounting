namespace LibAcct.App.Data;

public class EnrollmentEvent : IEntity
{
    public int Id { get; set; }
    public string Event { get; set; } = null!;
    public List<Enrollment> Enrollments { get; set; } = null!;
}
