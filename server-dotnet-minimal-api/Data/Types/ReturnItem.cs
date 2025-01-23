namespace LibAcct.Data.Types;

public class ReturnItem : IEntity
{
    public int Id { get; set; }
    public int ReturnId { get; set; }
    public int BookId { get; set; }
    public int Quantity { get; set; }
    public Book? Book { get; set; }
    public Return? Return { get; set; }
}
