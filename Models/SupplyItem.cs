using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class SupplyItem
{
    public int Id { get; set; }

    public int SupplyId { get; set; }

    public int BookId { get; set; }

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    [JsonIgnore]
    public virtual Book? Book { get; set; }

    [JsonIgnore]
    public virtual Supply? Supply { get; set; }
}
