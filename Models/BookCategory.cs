using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class BookCategory
{
    public int Id { get; set; }

    public string Category { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
