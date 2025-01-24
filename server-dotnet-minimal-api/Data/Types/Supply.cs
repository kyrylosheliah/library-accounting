namespace LibAcct.Data.Types;

public class Supply : IEntity
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int SupplierId { get; set; }
    public Supplier? Supplier { get; set; }
    public List<SupplyItem> SupplyItems { get; set; } = null!;
}
