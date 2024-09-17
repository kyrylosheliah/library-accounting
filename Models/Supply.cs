using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class Supply
{
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public int SupplierId { get; set; }

    [JsonIgnore]
    public virtual Supplier? Supplier { get; set; }

    [JsonIgnore]
    public virtual ICollection<SupplyItem> SupplyItems { get; set; } = new List<SupplyItem>();
}
