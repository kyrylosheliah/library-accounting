namespace LibAcct.App.Data;

public class MembershipTransaction : IEntity
{
    public int Id { get; set; }
    public int ReaderId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public User? Reader { get; set; }
}
