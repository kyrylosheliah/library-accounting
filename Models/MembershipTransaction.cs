using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class MembershipTransaction
{
    public int Id { get; set; }

    public int ReaderId { get; set; }

    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    [JsonIgnore]
    public virtual User? Reader { get; set; }
}
