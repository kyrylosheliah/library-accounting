namespace LibAcct.Data.Types;

public class Borrow : IEntity
{
    public int Id { get; set; }
    public int StaffId { get; set; }
    public int ReaderId { get; set; }
    public DateTime Date { get; set; }
    public List<BorrowItem> BorrowItems { get; set; } = [];
    public User? Reader { get; set; }
    public User? Staff { get; set; }
}
