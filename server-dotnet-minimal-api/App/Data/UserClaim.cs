namespace LibAcct.App.Data;

public class UserClaim : IEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Type { get; set; } = null!;
    public string Value { get; set; } = null!;
    public User? User { get; set; }
}
