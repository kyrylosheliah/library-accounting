namespace LibAcct.Data.Types;

public class BorrowItem : IEntity
{
    public int Id { get; set; }
    public int BorrowId { get; set; }
    public int BookId { get; set; }
    public int Quantity { get; set; }
    public DateTime ExpirationDate { get; set; }
    public Book? Book { get; set; }
    public Borrow? Borrow { get; set; }
    public List<Debt> Debts { get; set; } = [];
}
