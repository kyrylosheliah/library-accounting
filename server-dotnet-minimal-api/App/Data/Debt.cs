namespace LibAcct.App.Data;

public class Debt : IEntity
{
    public int Id { get; set; }
    public int ReaderId { get; set; }
    public int BorrowItemId { get; set; }
    public BorrowItem? BorrowItem { get; set; } = null!;
    public User? Reader { get; set; } = null!;
}
