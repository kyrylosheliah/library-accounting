using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class Book
{
    public int Id { get; set; }

    public int? CategoryId { get; set; }

    public string Title { get; set; } = null!;

    public string Author { get; set; } = null!;

    public int Year { get; set; }

    public string? Isbn { get; set; }

    public string? Annotation { get; set; }

    public int? BookingPolicy { get; set; }

    public int? QuantityPolicy { get; set; }

    [JsonIgnore]
    public virtual ICollection<BorrowItem> BorrowItems { get; set; } = new List<BorrowItem>();

    [JsonIgnore]
    public virtual BookCategory? Category { get; set; }

    [JsonIgnore]
    public virtual ICollection<ReturnItem> ReturnItems { get; set; } = new List<ReturnItem>();

    [JsonIgnore]
    public virtual ICollection<Shelf> Shelves { get; set; } = new List<Shelf>();

    [JsonIgnore]
    public virtual ICollection<SupplyItem> SupplyItems { get; set; } = new List<SupplyItem>();

    [JsonIgnore]
    public virtual ICollection<Wish> Wishes { get; set; } = new List<Wish>();
}
