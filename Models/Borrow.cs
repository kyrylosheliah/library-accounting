using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class Borrow
{
    public int Id { get; set; }

    public int StaffId { get; set; }

    public int ReaderId { get; set; }

    public DateTime Date { get; set; }

    [JsonIgnore]
    public virtual ICollection<BorrowItem> BorrowItems { get; set; } = new List<BorrowItem>();

    [JsonIgnore]
    public virtual User? Reader { get; set; }

    [JsonIgnore]
    public virtual User? Staff { get; set; }
}
