using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class Membership
{
    public int Id { get; set; }

    public int ReaderId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime ExpirationDate { get; set; }

    [JsonIgnore]
    public virtual User? Reader { get; set; }
}
