namespace LibAcct.Data.Types;

public class Appointment : IEntity
{
    public int Id { get; set; }
    public int StaffId { get; set; }
    public DateTime Date { get; set; }
    public DateTime Created { get; set; }
    public DateTime Modified { get; set; }
    public string Text { get; set; } = null!;
    public User? Staff { get; set; }
}
