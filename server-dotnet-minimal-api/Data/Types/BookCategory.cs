namespace LibAcct.Data.Types;

public class BookCategory : IEntity
{
    public int Id { get; set; }
    public string Category { get; set; } = null!;
    public List<Book> Books { get; set; } = null!;
}
