namespace LibAcct.Data.Types;

public class Book : IEntity
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
    public List<BorrowItem> BorrowItems { get; set; } = [];
    public BookCategory? Category { get; set; }
    public List<ReturnItem> ReturnItems { get; set; } = [];
    public List<Shelf> Shelves { get; set; } = [];
    public List<SupplyItem> SupplyItems { get; set; } = [];
    public List<Wish> Wishes { get; set; } = [];
}
