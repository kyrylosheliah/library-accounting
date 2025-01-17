using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class Shelf
{
    public int Id { get; set; }

    public int BookId { get; set; }

    public int Quantity { get; set; }

    [JsonIgnore]
    public virtual Book? Book { get; set; }
}
