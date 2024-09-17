using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class Wish
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int BookId { get; set; }

    [JsonIgnore]
    public virtual Book? Book { get; set; } = null!;

    [JsonIgnore]
    public virtual User? User { get; set; } = null!;
}
