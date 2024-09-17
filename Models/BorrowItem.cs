using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class BorrowItem
{
    public int Id { get; set; }

    public int BorrowId { get; set; }

    public int BookId { get; set; }

    public int Quantity { get; set; }

    public DateTime ExpirationDate { get; set; }

    [JsonIgnore]
    public virtual Book? Book { get; set; }

    [JsonIgnore]
    public virtual Borrow? Borrow { get; set; }

    [JsonIgnore]
    public virtual ICollection<Debt> Debts { get; set; } = new List<Debt>();
}
