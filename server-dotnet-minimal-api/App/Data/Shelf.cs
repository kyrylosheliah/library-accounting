namespace LibAcct.App.Data;

public class Shelf : IEntity
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public int Quantity { get; set; }
    public Book? Book { get; set; }
}
