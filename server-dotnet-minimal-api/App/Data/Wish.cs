namespace LibAcct.App.Data;

public class Wish : IEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public Book? Book { get; set; } = null!;
    public User? User { get; set; } = null!;
}
