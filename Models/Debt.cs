using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class Debt
{
    public int Id { get; set; }

    public int ReaderId { get; set; }

    public int BorrowItemId { get; set; }

    [JsonIgnore]
    public virtual BorrowItem? BorrowItem { get; set; } = null!;

    [JsonIgnore]
    public virtual User? Reader { get; set; } = null!;
}
