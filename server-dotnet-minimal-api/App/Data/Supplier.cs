namespace LibAcct.App.Data;

public class Supplier : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string? Address { get; set; }
    public string? Organization { get; set; }
    public List<Supply> Supplies { get; set; } = null!;
}
