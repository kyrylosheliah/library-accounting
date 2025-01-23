namespace LibAcct.Data.Types;

public class Membership : IEntity
{
    public int Id { get; set; }
    public int ReaderId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime ExpirationDate { get; set; }
    public User? Reader { get; set; }
}
