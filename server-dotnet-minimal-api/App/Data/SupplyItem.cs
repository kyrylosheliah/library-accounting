namespace LibAcct.App.Data;

public class SupplyItem : IEntity
{
    public int Id { get; set; }
    public int SupplyId { get; set; }
    public int BookId { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public Book? Book { get; set; }
    public Supply? Supply { get; set; }
}
